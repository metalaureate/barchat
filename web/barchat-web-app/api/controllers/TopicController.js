/**
 * TopicController
 *
 * @description :: Server-side logic for managing topics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var winston=require('winston');

module.exports = {
	extractGraph: function (req,res) {
    var corpus=req.body.corpus;
    winston.info('looking up corpus',corpus.substr(0,100));
    TopicalGraphService.extract(corpus, function (error, result) {
      winston.info('calais result',result,error);
      res.send(result);
    })
  }
};

