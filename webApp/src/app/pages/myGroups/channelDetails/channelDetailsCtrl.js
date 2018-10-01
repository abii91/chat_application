/**
* *
* created on 08.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.channelDetails')
  .controller('channelDetailsCtrl', channelDetailsCtrl);


  function channelDetailsCtrl($scope, $state, $stateParams, $http, $filter, config, generalHelper, localStorage, chatService, chatFactory, fileUpload) {

    var vm = this;
    var socket = io.connect('http://localhost:8080');
    vm.baseUrl = config.baseUrl;
    vm.selected_channel = $stateParams.id;

    showChat();

    socket.on('messageRec', function(data){
      showChat();
    });

    vm.current_user = generalHelper.getCurrentUser();

    vm.sendMessage = function(){
      vm.file = $scope.myPicture;
      chatService.sendSMS(vm)
      .then(function(msg_data){
        if(null != vm.file){
          fileUpload.uploadFileToUrl(vm.file, "/chat/"+ msg_data.id +"/uploadPhoto")
          .then(function(response){
            socket.emit('messageSend', msg_data);
            $scope.$parent.myPicture = null;
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

    vm.removePicture = function () {
      vm.picture = $filter('appImage')('theme/no-photo.png');
      vm.noPicture = true;
    };

    vm.uploadPicture = function () {
      var fileInput = document.getElementById('uploadFile');
      fileInput.click();
    };

    function showChat() {
      console.log("showChat");
      console.log(vm.selected_channel);
      if(vm.selected_channel > 0){
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
