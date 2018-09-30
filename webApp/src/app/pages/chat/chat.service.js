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
        recipient: msg_data.selected_user.id,
      };

      generalFactory.request("chat/sendChat", "POST", msg)
      .then(function(){
        msg_data.message = "";
        defer.resolve(msg_data);
      })
      .catch(function(err){
        defer.reject(err);
      });

      return defer.promise;
    }

    function showUserChat(chatVm, current_user){
      var defer = $q.defer();

      generalFactory.request("chat/getUserChat", "POST", {recipient: chatVm.selected_user.id})
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
