/**
 * *
 * created on 04.12.2017
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
      .factory('settingService', settingService);

  function settingService() {

      function getSettings(webservice_url, $http, $scope, settings, rowList, localStorage){
            $http.get(webservice_url)
           .then(function(response){
               var response_data = response.data;
               if(response_data.code == 'OK'){
                  $scope[rowList] = response_data.data;
                  $scope[settings] = [].concat($scope[rowList]);
               }
           })
           .catch(function(err){
               console.log(err);
           });
      }

      function saveSetting(webservice_url, $http, setting, localStorage){
          $http({
              method: "PUT",
              url: webservice_url,
              data: setting
          })
          .then(function(response){
              var response_data = response.data;
              if(response_data.code == 'CREATED' || response_data.code == 'OK'){

              }
          });
      }

      return {
          saveSetting: saveSetting,
          getSettings: getSettings,
      };
  }

})();
