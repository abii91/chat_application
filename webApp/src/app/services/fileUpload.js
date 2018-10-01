(function () {
  'use strict';

  angular.module('BlurAdmin.services')
  .service('fileUpload', fileUpload);

  function fileUpload($http, config, $q) {

    this.uploadFileToUrl = function(file, uploadUrl){
      var defer = $q.defer();

      var fd = new FormData();
      fd.append('file', file);

      console.log("uploadUrl");
      console.log(config);
      console.log(config.baseUrl + uploadUrl);
      $http.post(config.baseUrl + uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(function(response){
        defer.resolve(response);
      })
      .error(function(err){
        defer.reject(err);
      });

      return defer.promise;
    }
  };

})();
