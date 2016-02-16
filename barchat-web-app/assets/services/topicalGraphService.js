app.service('TopicalGraph', function ($log,$http,$q) {

    this.extract= function (corpus) {
      var deferred = $q.defer();
      $log.debug('extracting graph ', corpus.substr(0,200)+'...');
      $http.post('/api/topic/graph/extract/', {corpus: corpus.substr(0, 8000)}, {json: true}
      ).success(function (data) {

        deferred.resolve(data);
      }).error(function () {
        $log.error("Error getting topic graph");
        deferred.reject();
      });
      return deferred.promise;
    }
});
