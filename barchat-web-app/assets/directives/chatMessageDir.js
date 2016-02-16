app.directive("chatMessage", function ($log) {
  return {
    restrict: "A",
    scope: {
      "chat": "="
    },
    templateUrl: '/templates/directives/chatMessage.html',
    link: function (scope, element, attrs) {
      scope.chat.sentdatetime=moment(scope.chat.sentdatetime).fromNow();

      if (scope.chat.msgtype=='chat') {

      }
    }
  }
})
