app.controller('ChatController',function($http,$log,$scope,User,$timeout){
  $scope.predicate = '-id';
  $scope.reverse = false;
  $scope.baseUrl = 'http://localhost:1337';
  $scope.chatList =[];
  $scope.getAllchat = function(){

    io.socket.get('/chat/addconv');

    $http.get($scope.baseUrl+'/chat')
      .success(function(success_data){

        $scope.chatList = success_data;
        $log.info(success_data);
      });
  };

  $scope.getAllchat();
  $scope.chatUser = User.username;
  $scope.$watch(function () { return $scope.chatUser}, function (user) {User.username=user});
  $scope.chatMessage="";

  io.socket.on('chat',function(obj){

    if(obj.verb === 'created'){
      $log.info(obj)
      $scope.chatList.push(obj.data);
      $scope.$digest();
    }

  });

  $scope.sendMsg = function(){
    $log.info($scope.chatMessage);
    io.socket.post('/chat/addconv/',{user:User.username,message: $scope.chatMessage, msgtype: 'chat'});
    $scope.chatMessage = "";
  };


});
