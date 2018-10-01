/**
* *
* created on 28.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.chat')
  .service('chatService', chatService);


  function chatService($q, $http, config, localStorage, generalFactory) {
    var service = {
      sendSMS: sendSMS,
      showUserChat: showUserChat
    };
    return service;

    function sendSMS(msg_data){
      var defer = $q.defer();

      var msg = {
        text: msg_data.message,
      };

      if(msg_data.selected_user){
        msg.recipient = msg_data.selected_user.id
      }
      else if(msg_data.selected_channel){
        msg.channel = msg_data.selected_channel;
      }

      generalFactory.request("chat/sendChat", "POST", msg)
      .then(function(response){
        msg_data.message = "";
        defer.resolve(response.data);
      })
      .catch(function(err){
        defer.reject(err);
      });

      return defer.promise;
    }

    function showUserChat(chatVm, current_user){
      var defer = $q.defer();
      var data;
      if(chatVm.selected_user){
        data = {recipient: chatVm.selected_user.id};
      }
      else if(chatVm.selected_channel){
        data = {channel: chatVm.selected_channel};
      }

      generalFactory.request("chat/getUserChat", "POST", data)
      .then(function(response){
        defer.resolve(response.data);
      })
      .catch(function(err){
        defer.reject(err);
      });

      return defer.promise;
    }
  }

})();
