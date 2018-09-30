/**
 * *
 * created on 31.01.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
      .controller('addUserCtrl', addUserCtrl);


  function addUserCtrl($uibModalInstance, $scope, $http, channel, localStorage, editableOptions, editableThemes, config) {
      $scope.smartTablePageSize = 10;
      $scope.rowList = [];
      $scope.cities = [];

      getUnassignedUC();

      function getUnassignedUC(){
        var url = config.baseUrl+"/users?role_id=3";
        $http.get(encodeURI(url))
             .then(function(response){
                 var response_data = response.data;
                 if(response_data.code == 'OK'){
                    $scope.UCList = response_data.data;
                    $scope.UCs = [].concat($scope.UCList);
                 }
             });
      }

      $scope.assignUC = function () {
          var channel_users = [];
          $scope.UCs.forEach(function(uc){
              if(uc.selected){
                  channel_users.push({user_id: uc.id, channel: channel.id});
              }
          });
          $http({
              method: "POST",
              url: encodeURI(config.baseUrl+"/channels/assignUsers"),
              data: {users: channel_users}
          })
          .then(function(response){
               var response_data = response.data;
               if(response_data.code == 'OK'){
                  $uibModalInstance.close();
               }
           });
      };

      $scope.$on('$destroy', function() {
          $("#chat_danger_alert").hide();
          $("#chat_success_alert").hide();
      });
  }

})();
