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
    };
    return factory;

    function getChatUsers(){
      var defer = $q.defer();
      $http.get(config.baseUrl+"/getChatUsers")
      .then(function(response){
        generalHelper.getDeferResponse(response, defer);
      })
      .catch(function(err){
        generalHelper.getDeferError(err, defer);
      });
      return defer.promise;
    }

  }

})();
