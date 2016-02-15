app.directive("chatMessage", function ($log) {
  return {
    restrict: "A",
    scope: {
      "chat": "="
    },
    templateUrl: '/templates/directives/chatMessage.html',
    link: function (scope, element, attrs) {
      if (scope.chat.msgtype=='chat') {

      }
    }
  }
})
