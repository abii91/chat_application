/**
 * *
 * created on 31.01.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
      .controller('addChannelCtrl', addChannelCtrl);


  function addChannelCtrl($uibModalInstance, $scope, $http, group, localStorage, editableOptions, editableThemes, config) {
      $scope.smartTablePageSize = 10;
      $scope.rowList = [];
      $scope.cities = [];

      getUnassignedChannels();

      function getUnassignedChannels(){
        var url = config.baseUrl+"/channels/getUnassignedChannels";
        $http.get(encodeURI(url))
             .then(function(response){
                 var response_data = response.data;
                 if(response_data.code == 'OK'){
                    $scope.rowList = response_data.data;
                    $scope.channels = [].concat($scope.rowList);
                 }
             });
      }

      $scope.assignChannels = function () {
          var channel_ids = [];
          $scope.channels.forEach(function(channel){
              if(channel.selected){
                  channel_ids.push(channel.id);
              }
          });
          $http({
              method: "POST",
              url: encodeURI(config.baseUrl+"/channels/assignChannels"),
              data: {channels: channel_ids, group: group.id}
          })
          .then(function(response){
               var response_data = response.data;
               if(response_data.code == 'OK'){
                  $uibModalInstance.close();
               }
           });
      };

      $scope.$on('$destroy', function() {
          $("#obtech_danger_alert").hide();
          $("#obtech_success_alert").hide();
      });
  }

})();
