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
      var msg = {
        text: msg_data.message,
        recipient: msg_data.selected_user.id,
      };

      generalFactory.request("chat/sendChat", "POST", msg)
      .then(function(){
        msg_data.message = "";
      })
      .catch(function(err){
        res.serverError;
      });
    }

    function showUserChat(chatVm, current_user){
      var defer = $q.defer();

      generalFactory.request("chat/getUserChat", "POST", {recipient: chatVm.selected_user.id})
      .then(function(response){
        chatVm.chat_history = response.data;
        defer.resolve(chatVm.chat_history);
      })
      .catch(function(err){
        defer.reject(err);
      });

      return defer.promise;
    }
  }

})();
