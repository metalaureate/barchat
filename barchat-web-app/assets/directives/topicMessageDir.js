app.directive("topicMessage", function ($log) {
  return {
    restrict: "A",
    scope: {
      "chat": "="
    },
    templateUrl: '/templates/directives/topicMessage.html',
    link: function (scope, element, attrs) {
      if (scope.chat.msgtype=='topic') {
        scope.topic=JSON.parse(scope.chat.message);
        $log.info(scope.topic);
      }

    }
  }
});

