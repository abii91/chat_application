/**
* *
* created on 08.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.chat')
  .controller('chatCtrl', chatCtrl);


  function chatCtrl($scope, $state, $http, $filter, config, generalHelper, localStorage, chatService, chatFactory, fileUpload) {

    var vm = this;
    var socket = io.connect('http://localhost:8080');
    vm.baseUrl = config.baseUrl;

    socket.on('messageRec', function(data){
      showChat();
    });

    vm.selected_user;
    vm.current_user = generalHelper.getCurrentUser();

    chatFactory.getChatUsers()
    .then(function(users){
      vm.users = users;
      vm.filtered_users = vm.users;
    })
    .catch(function(err){
      generalHelper.showGeneralError();
    });

    vm.sendMessage = function(){
      vm.file = $scope.myPicture;

      chatService.sendSMS(vm)
      .then(function(msg_data){
        if(null != file){
          fileUpload.uploadFileToUrl(vm.file, "/chat/"+ msg_data.id +"/uploadPhoto")
          .then(function(response){
            socket.emit('messageSend', msg_data);
          })
          .catch(function(){
            generalHelper.showGeneralError();
          })
        }
        else {
          socket.emit('messageSend', msg_data);
        }

      })
      .catch(function(err){
        generalHelper.showGeneralError();
      });
    }

    vm.selectUser = function(user) {
      vm.selected_user = user;
      showChat();
    }

    vm.removePicture = function () {
      vm.picture = $filter('appImage')('theme/no-photo.png');
      vm.noPicture = true;
    };

    vm.uploadPicture = function () {
      var fileInput = document.getElementById('uploadFile');
      fileInput.click();
    };

    function showChat() {
      if(null != vm.selected_user){
        var current_user = localStorage.getObject('dataUser');
        chatService.showUserChat(vm, current_user)
        .then(function(chat_history) {
          vm.chat_history = chat_history;
          if (!$scope.$$phase) $scope.$apply();
          var scrollTo_val = $('#chat-history').prop('scrollHeight') + 'px';
          setTimeout(function(){ $('#chat-history').slimScroll({ scrollBy : '5000 px' }); }, 1000);
          $('#chat-history').slimScroll({ scrollBy : '5000 px' });
          $('#chat-history').slimScroll({ scrollBy : '5000 px' });
        })
        .catch(function(err){
          generalHelper.showGeneralError();
        });
      }
    }

    vm.searchUser = function(search_user){
      if(search_user == ""){
        vm.filtered_users = vm.users;
      }
      else{
        vm.filtered_users = $filter('filter')(vm.users, search_user);
      }
    }

    vm.showMessage = function() {
      var modal_options = {
        templateUrl: 'app/pages/chat/smsModal/smsModal.html',
        controller: 'smsModalCtrl',
        scope: $scope,
      };
      generalHelper.launchModal(modal_options);
    };

  }

})();
