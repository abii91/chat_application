/**
* *
* created on 08.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.chat')
  .controller('chatCtrl', chatCtrl);


  function chatCtrl($scope, $state, $http, $filter, generalHelper, localStorage, chatService, chatFactory) {

    var vm = this;

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
      chatService.sendSMS(vm);
    }

    vm.selectUser = function(user) {
      vm.selected_user = user;
      showChat();
    }

    function showChat() {
      if(null != vm.selected_user){
        var current_user = localStorage.getObject('dataUser');
        chatService.showUserChat(vm, current_user)
        .then(function(querySnapshot) {
          if (!$scope.$$phase) $scope.$apply();
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
