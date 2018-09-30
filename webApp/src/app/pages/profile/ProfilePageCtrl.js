/**
* @author v.lugovsky
* created on 16.12.2015
*/
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
  .controller('ProfilePageCtrl', ProfilePageCtrl);

  /** @ngInject */
  function ProfilePageCtrl($scope, fileReader, $filter, $uibModal, generalHelper, config, fileUpload, generalFactory) {

    var vm = this;

    vm.current_user = generalHelper.getCurrentUser();
    vm.picture = config.baseUrl + vm.current_user.profile;

    function getCurrentUser(){
      generalFactory.request("users/"+vm.current_user.id)
      .then(function(response){
        vm.current_user = response.data;
        vm.picture = config.baseUrl + vm.current_user.profile;
        generalHelper.setCurrentUser(vm.current_user);
      });
    }

    vm.removePicture = function () {
      vm.picture = $filter('appImage')('theme/no-photo.png');
      vm.noPicture = true;
    };

    vm.uploadPicture = function () {
      var fileInput = document.getElementById('uploadFile');
      fileInput.click();
    };

    vm.unconnect = function (item) {
      item.href = undefined;
    };

    vm.updateProfile = function(){
      var file = $scope.myPicture;

      fileUpload.uploadFileToUrl(file, "/users/"+ vm.current_user.id +"/uploadPhoto")
      .then(function(response){
        getCurrentUser();
      })
      .catch(function(){
        generalHelper.showGeneralError();
      })
    }

  }

})();
