/**
* Chathistory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

module.exports = {

  attributes: {
    id: {
      type: "integer",
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    text: {
      type: "text"
    },
    file: {
      type: "text"
    },
    sender: {
      model: "Users",
    },
    recipient: {
      model: "Users",
    },
    channel: {
      model: "Channels",
    }
  }

};
