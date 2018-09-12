/**
* *
* created on 28.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.chat')
  .service('chatService', chatService);


  function chatService($q, $http, config, localStorage) {
    var service = {
      sendSMS: sendSMS,
      showUserChat: showUserChat
    };
    return service;

    function sendSMS(msg_data){
      var firebase_ref = firebase.firestore().collection('messages');
      var ar_id, current_user = localStorage.getObject('dataUser');

      if(msg_data.selected_user.user_id < current_user.user_id){
        ar_id = msg_data.selected_user.user_id+"-"+current_user.user_id;
      }
      else{
        ar_id = current_user.user_id+"-"+msg_data.selected_user.user_id;
      }

      var msg = {
        text: msg_data.message,
        time: firebase.firestore.FieldValue.serverTimestamp(),
        author_receiver: ar_id,
        author: {
          name: current_user.first_name+" "+current_user.last_name,
          id: current_user.user_id,
          avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_3_400x400.png"
        },
        receiver: {
          name: msg_data.selected_user.first_name+" "+msg_data.selected_user.last_name,
          id: msg_data.selected_user.user_id,
          avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_3_400x400.png"
        }
      };
      var doc = firebase_ref.doc();
      var id = doc.id;
      msg.id = id;
      firebase_ref.add(msg);

      msg_data.message = "";
    }

    function showUserChat(chatVm, current_user){
      var ar_id, chat;
      var defer = $q.defer();
      var firebase_ref = firebase.firestore().collection('messages');

      if(chatVm.selected_user.user_id < current_user.user_id){
        ar_id = chatVm.selected_user.user_id + "-" + current_user.user_id;
      }
      else{
        ar_id = current_user.user_id + "-" + chatVm.selected_user.user_id;
      }
      firebase_ref.where("author_receiver","==",ar_id).orderBy("time").onSnapshot(function(querySnapshot) {
        chatVm.chat_history = [];
        querySnapshot.forEach(function(doc) {
          chat = doc.data();
          chatVm.chat_history.push(chat);
        });
        defer.resolve(querySnapshot);
      });

      return defer.promise;
    }
  }

})();
