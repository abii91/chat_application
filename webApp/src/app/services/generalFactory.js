(function () {
  'use strict';

  angular.module('BlurAdmin.services')
  .factory('generalFactory', generalFactory);

  function generalFactory($q, $http, config, generalHelper, fileDownload) {

    return {
      request: request,
      getFileFromServer: getFileFromServer
    }

    function request(action, method, data, respAttrib){
      var defer = $q.defer();
      var action_url = config.baseUrl + "/" + action;
      var params = { url: action_url };

      if(undefined === method)
        method = "GET";

      if(undefined === respAttrib)
        respAttrib = 'data';

      params.data   = data;
      params.method = method;

      console.log("request" + JSON.stringify(params));

      $http(params)
      .then(function(response){
        if( 'raw' === respAttrib )
          defer.resolve(response);
        else
          defer.resolve(response[respAttrib]);
      })
      .catch(function(err){
        generalHelper.getDeferError(err, defer);
      });

      return defer.promise;
    }

    function getFileFromServer(action, data, fileName){
      var defer = $q.defer();
      var action_url = config.baseUrl + "/" + action;
      var params = { url: action_url };
      params.data = data;
      params.method = "POST";

      console.log("request" + JSON.stringify(params));

      $http(params)
      .success(function (response_data, status, headers) {
        headers = headers();
        fileDownload.download(response_data, headers, fileName);
        defer.resolve(response_data);

      }).error(function (err) {
        generalHelper.getDeferError(err, defer);
      });
      return defer.promise;
    }

  }
})();
