/**
 * *
 * Created on 05.01.2018.
*/

(function () {
'use strict';

angular.module('BlurAdmin.pages.users')
  .factory('usersService', usersService);

function usersService(localStorage, $http, config, generalFactory) {

  function getUsers($scope, role_id, tab) {
    generalFactory
      .request('users?role_id=' + role_id)
      .then(function(response){
        if(response.code == 'OK'){
          $scope.rowList = response.data;
          $scope.users = angular.copy($scope.rowList);
          $scope.tab = tab;
        }
      })
  }

  return {
    getUsers: getUsers
  };
}

})();
