app.service('WikiData', function ($q, $http, $log, Topic, Flash) {
  this.getQData = function (mid) {
    var deferred = $q.defer();
    if (!mid) {
      alert(mid);
      return deferred.reject()
    }
    this.waiting = false;
    $log.debug('item', mid);
    this.waiting = true;
    $http.jsonp('https://www.wikidata.org/w/api.php', {
      params: {
        ids: mid,
        action: 'wbgetentities',
        format: 'json',
        languages: 'en',
        callback: 'JSON_CALLBACK'
      }
    }).then(function (res) {
      $log.debug('wiki data', res.data);
      var wiki_title, description;
      try {
        description = res.data.entities[mid].descriptions.en.value;
      } catch(e) {
      }
      try {
        wiki_title = res.data.entities[mid].sitelinks.enwiki.title;

      } catch (e) {
        $log.debug('no wikipedia page found');
        var flashId = Flash.create('warning', "<strong>Not found</strong> Sorry, can't find a wikipedia entry for that. Please rephrase.", 2000, {
          class: 'custom-class',
          id: 'custom-id'
        }, true);

        wiki_title = s.capitalize(res.data.entities[mid].labels.en.value);
        return deferred.resolve(null);
      }
      // var wiki_url="https://en.wikipedia.org/wiki/"+encodeURIComponent(wiki_title);
      $log.debug('wiki title', wiki_title);
      $http.jsonp('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'parse',
          format: 'json',
          prop: 'text',
          section: '0',
          page: wiki_title,
          callback: 'JSON_CALLBACK'
        }
      }).then(function (res) {
        $log.debug('wikipedia response', res);
        var extract;
        extract = res.data.parse.text['*'];
        extract = s.stripTags(extract);
        Topic.description = accumulateString(Topic.description, description);
        Topic.description = accumulateString(Topic.description, extract);

        this.waiting = false;
        Topic.wikiURL = "https://en.wikipedia.org/wiki/" + wiki_title.replace(/ /ig, '_');
        deferred.resolve(Topic);
      });
    });
    return deferred.promise;

  }
  function accumulateString(body, str) {
    body = body || '';
    str = str || '';
    var r = new RegExp(quote(str) + '', 'ig');
    if ((body + '').match(r)) {
      return body;
    } else {
      return body += ':: ' + str;
    }
  }

  function quote(str) {
    return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  };
});
