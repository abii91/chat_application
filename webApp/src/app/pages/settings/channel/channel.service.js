/**
* *
* created on 04.12.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
  .factory('channelsService', channelsService);

  function channelsService($http, localStorage, config, generalFactory) {

    function getChannels(parentScope) {
      var url = "channels";
      generalFactory.request(url)
      .then(function(response){
        if(response.code == 'OK'){
          parentScope.channelsList = response.data;
          parentScope.channels = [].concat(parentScope.channelsList);
        }
      });
    }

    function getGroupChannels(parentScope, group) {
      var url = "channels";
      if(group > 0){
        url += "?group_id="+group;
      }
      generalFactory.request(url)
      .then(function(response){
        if(response.code == 'OK'){
          parentScope.groupChannelList = response.data;
          parentScope.groupChannels = [].concat(parentScope.groupChannelList);
        }
      });
    }

    function getAllChannels(parentScope) {
      return generalFactory.request("channels")
      .then(function(response){
        if(response.code == 'OK'){
          return response.data;
        }
      });
    }

    return {
      getChannels: getChannels,
      getGroupChannels: getGroupChannels,
      getAllChannels: getAllChannels
    };
  }

})();
