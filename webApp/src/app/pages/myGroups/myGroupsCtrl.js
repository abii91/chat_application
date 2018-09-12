/**
* *
* created on 28.10.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myGroups')
  .controller('myGroupsCtrl', myGroupsCtrl);

  function myGroupsCtrl($scope, generalFactory, channelsService) {
    $scope.selectedGroup = null;
    generalFactory.request("groups")
    .then(function(response){
      if(response.code == 'OK'){
        $scope.rowList = response.data;
        $scope.groups = [].concat($scope.rowList);
      }
    });

    $scope.selectGroup = function(group) {
      $scope.selectedGroup = group;
      channelsService.getGroupChannels($scope, $scope.selectedGroup.id);
    };

  }

})();
