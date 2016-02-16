/**
 * TopicalGraphService
 *
 * @description :: Server-side service for extracting topic tags from a corpus (e.g., a wikipedia entry)
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var winston=require('winston');
var _=require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());


module.exports = {

  extract: function (corpus, callback) {
    var util = require('util');
    var request = require('request');
    var stop_list = ['entertainment-culture', 'health-medical-pharma', 'hospitality-recreation', 'religion-belief',
      'technology-internet', 'human-interest', 'business-finance', 'pinterest', 'world-wide-web', 'browser', 'web-2-0',
      'internet', 'digital-media', 'image-hosting', 'photo-sharing', 'disaster-accident', 'outline', 'adjective', 'noun', 'grammar', 'plural', 'null', 'undefined', 'redirect', 'grammatical-number'];

    request.post("https://api.thomsonreuters.com/permid/calais", {
      timeout: 9000,
      rejectUnauthorized: false,
      headers: {
        'x-ag-access-token': sails.config.open_calais.key,
        'content-type': 'text/raw',
        'outputformat': 'application/json',
        'enableMetadataType': 'SocialTags'
      }, 'body': corpus
    }, function (error, result) {
      //util.puts(util.inspect(result.body, { showHidden: true, depth: null }));
      if (!result) {
        winston.debug('Open Calais returned null');
        return callback(null, null);
      }

      var resp = '';
      if (result.statusCode != 200) {
        winston.debug(result.statusCode, result.body);
        return callback(result.body,null);
      } else {
        resp = JSON.parse(result.body);
      }
      var tags = _.keys(resp), socialTags = [];
      var stopex = new RegExp(stop_list.join('|'), "ig");
      _.each(tags, function (tag) {
        // ad hoc rules to try to clean up the crap that comes back from OpenCalais and format it
        if (_.str.include(tag, 'SocialTag')) {
          var tag_name = resp[tag].name;
          if (tag_name.split(' ').length < 5) {
            if (!(_.findWhere(socialTags, {slug: _.slugify(tag_name)}))) { //depudes
              if (!_.slugify(tag_name).match(stopex)) {
                if (!(tag_name.match(/Draft\:|Template\:/ig))) {
                  socialTags.push({text: tag_name, slug: _.slugify(tag_name)});
                }
              }
            }
          }

        }
      });
      callback(null,socialTags);
    });

  }
}

