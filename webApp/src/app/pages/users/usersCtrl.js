/**
 * *
 * created on 25.10.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
      .controller('usersCtrl', usersCtrl);

  /** @ngInject */
  function usersCtrl($scope, usersService, config, OBTechRoles) {
    $scope.tab = "SA"
    usersService.getUsers($scope, OBTechRoles.super_admin, $scope.tab);

    $scope.selectTab = function(tab){
      if(tab == "SA"){
        usersService.getUsers($scope, OBTechRoles.super_admin, tab);
      }
      if(tab == "GA"){
        usersService.getUsers($scope, OBTechRoles.group_admin, tab);
      }
      if(tab == "users"){
        usersService.getUsers($scope, OBTechRoles.users, tab);
      }
    }
  }

})();
