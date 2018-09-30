/**
 * *
 * created on 25.10.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
      .controller('usersCtrl', usersCtrl);

  /** @ngInject */
  function usersCtrl($scope, usersService, config, ChatRoles) {
    $scope.tab = "SA"
    usersService.getUsers($scope, ChatRoles.super_admin, $scope.tab);

    $scope.selectTab = function(tab){
      if(tab == "SA"){
        usersService.getUsers($scope, ChatRoles.super_admin, tab);
      }
      if(tab == "GA"){
        usersService.getUsers($scope, ChatRoles.group_admin, tab);
      }
      if(tab == "users"){
        usersService.getUsers($scope, ChatRoles.users, tab);
      }
    }
  }

})();
