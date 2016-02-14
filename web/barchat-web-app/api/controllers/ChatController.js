/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addConv:function (req,res) {

    var data_from_client = req.params.all();

    if(req.isSocket && req.method === 'POST'){

      // This is the message from connected client
      // So add new conversation
      Chat.create(data_from_client)
        .exec(function(error,data_from_client){
          console.log('client data',data_from_client);
          var payload={id: data_from_client.id, message : data_from_client.message , user:data_from_client.user};
          payload.toJSON=function () { return payload};

          console.log(error,payload);
          Chat.publishCreate(payload);
        });
    }
    else if(req.isSocket){
      Chat.watch(req.socket);
      console.log( 'User subscribed to ' + req.socket.id );
    }
  }
};

