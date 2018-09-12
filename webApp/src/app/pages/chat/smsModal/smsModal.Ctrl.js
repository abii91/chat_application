/**
* *
* created on 12.03.2018
*/

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.chat')
  .controller('smsModalCtrl', smsModalCtrl);

  /** @ngInject */
  function smsModalCtrl($scope, generalHelper, regionsService, rolesService, chatFactory) {
    var vm = this;

    rolesService.getAllRoles()
    .then(function(roles){
      vm.roles = roles.map(function(role) {
        if(role.role_name != 'Admin'){
          return {
            value: role.role_id,
            label: role.role_name
          };
        }
      });
    });

    regionsService.getAllRegions()
    .then(function(regions){
      vm.regions = regions.map(function(region) {
        return {
          value: region.id,
          label: region.name
        };
      });
    });

    vm.sendSMS = function(sms){
      chatFactory.sendPhoneSMS(sms)
      .then(function(response){
        // $uibModalInstance.close();
      })
      .catch(function(){
        generalHelper.showGeneralError();
      });
    };
  }

})();
