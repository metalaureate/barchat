app.controller("TopicCtrl", function ($scope, $http, $log, Topic, WikiData, TopicalGraph, oEmbed,
                                      Flash, User,$timeout,$stateParams) {
  $scope.topicSelection = {value: null};
  $scope.Topic=Topic;

  /*
   var id = Flash.create('success', '<strong>Well done!</strong> You successfully read this important alert message.', 5000, {
   class: 'custom-class',
   id: 'custom-id'
   }, true);
   */

  $scope.getEntities = function (val) {
    $log.debug('looking up', val);
    return $http.jsonp('https://www.wikidata.org/w/api.php', {
      params: {
        search: val,
        action: 'wbsearchentities',
        format: 'json',
        language: 'en',
        type: 'item',
        limit: 20,
        continue: 0,
        callback: 'JSON_CALLBACK'
      }
    }).then(function (res) {
      var results = [];
      if (res.data.search) {
        results = _.map(res.data.search, function (m) {
          return {
            name: s.capitalize(m.label),
            mid: m.id,
            description: m.description,
            slug: s.slugify(m.label)
          }
        });
        var ff;
        results = _.filter(results, function (f) {
          ff = true;
          if (f.description && f.description.match(/disambiguation/ig)) {
            ff = false
          }
          return ff
        });
        results = _.unique(results, function (m) {
          return m.name + (m.description || '').substr(0, 5)
        });
      }
      $log.debug('search', results);

      return results;
    });
  };

  $scope.pickTopic = function (item, model, label) {

    Topic.wikiID = item.mid;
    Topic.name = item.name;
    Topic.description = item.description;
    Topic.slug = item.slug;

  }

  $scope.$watch(function () {
    return Topic.wikiID
  }, function (wikiID) {
    $log.debug('wikiID changed', wikiID);
    if (wikiID) {
      $log.debug('wikiID', wikiID);
      Topic.isInitializing = true;
      WikiData.getQData(wikiID).then(function (topic) {
        $log.debug('topic', topic);
        if (!topic)  { Topic.isInitializing=false; return}
        TopicalGraph.extract(Topic.description).then(function (topics) {
          $log.debug('topic graph', topics);
          Topic.relatedTopics=topics;
          oEmbed.get(Topic.wikiURL).then(function (embed) {
            $log.debug('preview',embed);
            Topic.wikiImgSrc=(embed) ? embed.thumbnail_url : null;
            Topic.isInitializing = false;
            // var topicList= topics.join(_.map(topics, function (t) { return t.text}),", ");
            io.socket.post('/chat/addconv/',{user:User.username,message: JSON.stringify(Topic), msgtype:'topic'});

          });


        }, function (error) {
          alert('hello');
          Topic.isInitializing = false;
        });


      });
    } else {
      Topic.isInitializing = false;
    }

  });

  if ($stateParams.search) {
    $scope.topicSelection.value=null;
    var search=($stateParams.search.replace(',',' ')).split(' ');
    search.length=2;
    $scope.typeahead_selected_id = search.join(' ');
  }


});


app.directive('triggerTypeahead', function ($timeout, $log) {
  function linkFunc(scope, attrs, element, ngModel) {
    scope.$watch('trigger', function (value) {
      $log.debug('trigger typeahead', value);
      ngModel.$setViewValue(value); //trigger $parser through $setViewValue.
    });

  }

  return {
    link: linkFunc,
    require: 'ngModel',
    restrict: 'A',
    scope: {trigger: "="}
  };
});
