/**
* Route Mappings
* (sails.config.routes)
*
* For more information on configuring custom routes, check out:
* http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
*/

module.exports.routes = {


  '/': {
    view: 'homepage'
  },

  // Auth routes

  'post /signin': {
    controller: 'AuthController',
    action: 'UserLogin'
  },



  // Users routes

  'get /users': {
    controller: 'UsersController',
    action: 'getUsers'
  },

  'get /getChatUsers': {
    controller: 'UsersController',
    action: 'getChatUsers'
  },


  // Channel routes

  'get /getGroupChannels': {
    controller: 'ChannelsController',
    action: 'getGroupChannels'
  },

  'get /channels/getUnassignedChannels': {
    controller: 'ChannelsController',
    action: 'getUnassignedChannels'
  },

  'post /channels/assignChannels': {
    controller: 'ChannelsController',
    action: 'assignChannels'
  },

  'post /channels/removeGroupChannels': {
    controller: 'ChannelsController',
    action: 'removeGroupChannels'
  },

  'get /channels/getChannelUsers': {
    controller: 'ChannelsController',
    action: 'getChannelUsers'
  },

  'post /channels/assignUsers': {
    controller: 'ChannelsController',
    action: 'assignUsers'
  },

  'post /channels/removeChannelUsers': {
    controller: 'ChannelsController',
    action: 'removeChannelUsers'
  },

  'get /channels/getUserChannels': {
    controller: 'ChannelsController',
    action: 'getUserChannels'
  },

  // Group routes

  'get /groups/getUserGroups': {
    controller: 'GroupsController',
    action: 'getUserGroups'
  },


  // Chat routes

  'post /chat/sendChat': {
    controller: 'ChathistoryController',
    action: 'sendChat'
  },


  'post /chat/getUserChat': {
    controller: 'ChathistoryController',
    action: 'getUserChat'
  },

};
