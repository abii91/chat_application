/**
 * *
 * created on 28.10.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
      .controller('settingsCtrl', settingsCtrl);

  function settingsCtrl($scope, channelsService) {
      $scope.tab = "groups"
      $scope.selectTab = function(tab){
          $scope.tab = tab;

          if($scope.tab == "channels"){
            channelsService.getChannels($scope);
          }
      }
  }

})();
