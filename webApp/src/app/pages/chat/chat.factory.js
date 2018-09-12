/**
* *
* created on 28.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.chat')
  .factory('chatFactory', chatFactory);


  function chatFactory($q, $http, config, localStorage, generalHelper) {

    var factory = {
      getChatUsers: getChatUsers,
      sendPhoneSMS: sendPhoneSMS
    };
    return factory;

    function getChatUsers(){
      var defer = $q.defer();
      $http.get(config.baseUrl+"/users")
      .then(function(response){
        generalHelper.getDeferResponse(response, defer);
      })
      .catch(function(err){
        generalHelper.getDeferError(err, defer);
      });
      return defer.promise;
    }

    function sendPhoneSMS(sms){
      var defer = $q.defer();

      $http({
        method: "POST",
        url: config.baseUrl+"/sendSMS",
        data: sms
      })
      .then(function(response){
        if(response.data.code == 'OK'){
          generalHelper.showSuccessAlert("Your message has been sent successfully.");
          defer.resolve(response.data);
        }
      })
      .catch(function(){
        generalHelper.getDeferError(err, defer);
      });

      return defer.promise;
    }

  }

})();
