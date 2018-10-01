/**
 * Channels.js
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
    name: {
      type: "string",
      size: 255
    },
    group_id: {
      model: "Groups"
    },
    channel_users: {
      collection: "Users",
      via: "user_channels",
      through: "channelusers"
    },
  },
  beforeCreate: function (values, next) {

    EntityStore.findOne({table_name: "channels"})
    .then(function(entitystore){
      values.id = entitystore.last_value;
      entitystore.last_value++;
      entitystore.save();
      next();
    })

  }
};
