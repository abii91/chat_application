/**
* *
* created on 28.10.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myGroups')
  .controller('myGroupsCtrl', myGroupsCtrl);

  function myGroupsCtrl($scope, generalFactory, generalHelper, channelsService) {
    $scope.selectedGroup = null;
    var current_user = generalHelper.getCurrentUser();
    generalFactory.request("groups/getUserGroups?user_id=" + current_user.id)
    .then(function(response){
      if(response.code == 'OK'){
        $scope.rowList = response.data;
        $scope.groups = [].concat($scope.rowList);
      }
    });

    $scope.selectGroup = function(group) {
      $scope.selectedGroup = group;
      generalFactory.request("channels/getUserChannels?user_id=" + current_user.id + "&group_id=" + $scope.selectedGroup.id)
      .then(function(response){
        if(response.code == 'OK'){
          $scope.groupChannelList = response.data;
          $scope.channels = [].concat($scope.groupChannelList);
        }
      });
    };

  }

})();
