
app.service('WikiData', function ($q, $http, $log) {
  this.getQData = function (mid) {
    var deferred = $q.defer();
    this.waiting = false;


    $log.debug('item', mid);
    var token = {
      description: '',
      images: [],
      title: '',
      tokenURL: null,
      primaryID: {name: null, mid: null}
    }

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

        wiki_title = res.data.entities[mid].sitelinks.enwiki.title;

      } catch (e) {
        $log.debug('no wikipedia page found');

        wiki_title = s.capitalize(res.data.entities[mid].labels.en.value);

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
        // https://en.
        // wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Veganism
        var extract;
        extract = res.data.parse.text['*'];
        extract = s.stripTags(extract);

        // $log.debug('wiki content', extract);
        // token.description = accumulateString(token.description, wiki_title);

        token.description = accumulateString(token.description, description);
        token.description = accumulateString(token.description, extract);


        this.waiting = false;
        token.tokenURL = "https://en.wikipedia.org/wiki/" + wiki_title.replace(/ /ig, '_');
        token.title = wiki_title;
        token.primaryID.name = wiki_title;
        token.primaryID.mid = mid;

        deferred.resolve(token);


      });


    });
    return deferred.promise;

  }

});
