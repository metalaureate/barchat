/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // Both fields are set to required
    user:{
      type:'string',
      required:true
    },
    message:{
      type:'string',
      required:true
    },
    msgtype: {
      type:'string',
      required:false
    },
    sentdatetime: {
      type: 'date',
      required:false
    }

  }
};

