/**
* Users.js
*
* @description :: Attributes and properties for Users table
*/

module.exports = {

  attributes: {
    id: {
      type: "integer",
      primaryKey: true,
      unique: true,
    },
    first_name: {
      type: "string",
      size: 255
    },
    last_name: {
      type: "string",
      size: 255
    },
    user_name: {
      type: "string",
      size: 255,
      unique: true
    },
    email: {
      type: "string",
      size: 255,
    },
    profile: {
      type: "text"
    },
    password: {
      type: "text"
    },
    activated: {
      type: "boolean"
    },
    role_id: {
      model: "Roles"
    },
    user_channels: {
      collection: "Channels",
      via: "channel_users",
      through: "channelusers"
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeUpdate: function (values, next) {
    Users.findOne(values.id)
    .then(function(user){
      if(null == user){
        next();
      }
      else if(values.password && user.password == values.password){
        next();
      }
      else{
        SecurityService.hashPassword(values)
        .then(function(){ next(); })
        .catch(function(){ next(); });
      }
    })
    .catch(function(){
      next();
    });
  },
  beforeCreate: function (values, next) {

    EntityStore.findOne({table_name: "users"})
    .then(function(entitystore){
      values.id = entitystore.last_value;
      entitystore.last_value++;
      entitystore.save();
      SecurityService.hashPassword(values)
      .then(function(){ next(); })
      .catch(function(){ next(); });
    })
  }

};
