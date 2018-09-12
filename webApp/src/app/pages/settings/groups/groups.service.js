/**
* @author ibtesam.latif
* created on 29.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
  .service('groupsService', groupsService);

  function groupsService($q, generalHelper, generalFactory){

    var service = {
      getAllGroups: getAllGroups
    }
    return service;

    function getAllGroups(){
      var defer = $q.defer();
      generalFactory.request("groups")
      .then(function(response){
        if(response.code == 'OK'){
          defer.resolve(response.data);
        }
      })
      .catch(function(err){
        generalHelper.getDeferError(err, defer);
      });
      return defer.promise;
    }
  }

})();
