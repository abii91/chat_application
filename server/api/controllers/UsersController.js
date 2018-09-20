/**
* UsersController
*
* @description :: Server-side logic for managing users
*/

var Promise = require('bluebird');
var randtoken = require('rand-token');

module.exports = {
  getUsers: function(req, res){
    var criteria = {};
    if(req.param("role_id") > 0){
      criteria.role_id = Number(req.param("role_id"));
    }
    Users.find(criteria)
    .populate("role_id")
    .then(function(users){
      res.ok(users);
    })
    .catch(function(err){
      res.serverError;
    })
  },

  getChatUsers: function(req, res){
    Users.find({id: {"!": req.user.id}})
    .populate("role_id")
    .then(function(users){
      res.ok(users);
    })
    .catch(function(err){
      res.serverError;
    })
  }


};
