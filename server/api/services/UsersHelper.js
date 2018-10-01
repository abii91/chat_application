var defer = require('node-defer');

module.exports = {
  getUser: function (params) {
    Users.findOne(params)
    .then(function(user){
      Roles.findOne(user.role_id)
      .then(function(role){
        
      })
    })
    .catch(function(err){

    });
  },

  getUsers: function (params) {
    Users.find(params)
    .then(function(users){

    })
    .catch(function(err){

    });
  },
};
