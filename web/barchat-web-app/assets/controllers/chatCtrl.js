app.controller('ChatController', function ($http, $log, $scope, User, $timeout, $uibModal,$stateParams,$uiViewScroll) {
  $scope.predicate = '-id';
  $scope.reverse = false;
  $scope.baseUrl = 'http://localhost:1337';
  $scope.chatList = [];
  $scope.getAllchat = function () {

    io.socket.get('/chat/addconv');

    $http.get($scope.baseUrl + '/chat')
      .success(function (success_data) {

        $scope.chatList = success_data;
        $log.info(success_data);
       $timeout(function () {
         $uiViewScroll($("#bottom-of-screen"));
       },200);
      });
  };

  $scope.getAllchat();
  $scope.chatUser = User.username;
  $scope.$watch(function () {
    return $scope.chatUser
  }, function (user) {
    User.username = user
  });
  $scope.chatMessage = "";

  io.socket.on('chat', function (obj) {

    if (obj.verb === 'created') {
      $log.info(obj)
      $scope.chatList.push(obj.data);
      $scope.$digest();
      $uiViewScroll($("#bottom-of-screen"));
    }

  });

  $scope.sendMsg = function () {
    if (!$scope.chatMessage) return
    $log.info($scope.chatMessage);
    io.socket.post('/chat/addconv/', {user: User.username, message: $scope.chatMessage, msgtype: 'chat'});
    $scope.chatMessage = "";
    $uiViewScroll($("#bottom-of-screen"));
  };

  $scope.commandCheck = function (change,search) {
    var debounce=false;
    if (change.match(/\/topic/ig) && !debounce) {
      debounce=true;
      var topicSearchModal = $uibModal.open({
        animation: false,
        templateUrl: '/templates/views/topicSearch.html',
        controller: 'TopicCtrl',
        size: 'md',
        resolve: {
          prepopSearch: function () { return search }
        }
      });

      topicSearchModal.result.then(function (topic) {
        $log.info(topic);
        debounce=false;
        $stateParams.search=null;
        $scope.chatMessage=null;
        $uiViewScroll($("#bottom-of-screen"));
      }, function () {
        debounce=false;
        $stateParams.search=null;
        $log.info('Modal dismissed at: ' + new Date());
        $uiViewScroll($("#bottom-of-screen"));
      });
    }

  }


  if ($stateParams.search) {
    $scope.commandCheck('/topic',$stateParams.search);
  }
});
