
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
  .controller('pageTopCtrl', pageTopCtrl);


  function pageTopCtrl($scope, generalHelper, config) {
    $scope.baseUrl = config.baseUrl;
    $scope.current_user = generalHelper.getCurrentUser();
  }

})();
