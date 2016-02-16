/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addConv: function (req, res) {

    var data = req.params.all();

    if (req.isSocket && req.method === 'POST') {

      // This is the message from connected client
      // So add new conversation
      Chat.create(data)
        .exec(function (error, data) {
          console.log('client data', data);
          var msg = {
            id: data.id, message: data.message,
            user: data.user, msgtype: data.msgtype,
            sentdatetime: data.sentdatetime
          };
          msg.toJSON = function () {
            return msg
          };

          console.log(error, msg);
          Chat.publishCreate(msg);
        });
    }
    else if (req.isSocket) {
      Chat.watch(req.socket);
      console.log('User subscribed to ' + req.socket.id);
    }
  }
};

