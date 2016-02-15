app.controller("TopicCtrl", function ($scope, $http, $log, Topic, WikiData, TopicalGraph, oEmbed,
                                      Flash, User, $timeout, $stateParams, $uibModalInstance, prepopSearch, $uiViewScroll) {
  $scope.topicSelection = {value: null};
  $scope.Topic = Topic;
  $scope.typeahead_selected_id=null;
  /*
   var id = Flash.create('success', '<strong>Well done!</strong> You successfully read this important alert message.', 5000, {
   class: 'custom-class',
   id: 'custom-id'
   }, true);
   */

  // pre-populate search if oneis specific
  if (prepopSearch) {
    $log.info("Prepopulating search with ",prepopSearch);
    $scope.topicSelection.value = null;
    var search = (prepopSearch.replace(',', ' ')).split(' ');
    search.length = 2;
    $timeout(function () {
      $scope.typeahead_selected_id = search.join(' ');
    }, 500)

  }

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
    if (Topic.wikiID) {
      $log.debug('wikiID', Topic.wikiID);
      Topic.isInitializing = true;
      WikiData.getQData(Topic.wikiID).then(function (topic) {
        $log.debug('topic', topic);
        if (!topic) {
          Topic.isInitializing = false;
          $uibModalInstance.close(item);

          return
        }
        TopicalGraph.extract(Topic.description).then(function (topics) {
          $log.debug('topic graph', topics);
          Topic.relatedTopics = topics;
          oEmbed.get(Topic.wikiURL).then(function (embed) {

            $log.debug('preview', embed);
            Topic.wikiImgSrc = (embed) ? embed.thumbnail_url : null;
            Topic.isInitializing = false;
            // var topicList= topics.join(_.map(topics, function (t) { return t.text}),", ");
            io.socket.post('/chat/addconv/', {user: User.username, message: JSON.stringify(Topic), msgtype: 'topic'});

            $uibModalInstance.close(item);

          });


        }, function (error) {
          Topic.isInitializing = false;
          $uibModalInstance.close(item);

        });


      });
    } else {
      Topic.isInitializing = false;
      $uibModalInstance.close(item);

    }

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

app.directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        console.log('value=',value);
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
      element.bind('blur', function() {
        console.log('blur');
        try {
          scope.$apply(model.assign(scope, false));

        } catch (e) {

        }
      })
    }
  };
});
