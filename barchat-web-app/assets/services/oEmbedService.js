app.service('oEmbed', function ($log, $http) {
  this.get = function (url) {
    return $http.get("https://api.embed.ly/1/oembed", {
      params: {
        key: '7f97f36485464177b9ad604ae3607102',
        url: encodeURI(url).replace(',',"%2C"),
        maxwidth: 1280,
        maxHeight: 1024,
        format: 'json'
      }
    }).then(function (res) {
      $log.debug(res.data);

      return res.data;
    }, function (error) {
      $log.error(error);
      return null;
    });

  }

});
