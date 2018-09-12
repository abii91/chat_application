var app = angular.module('BlurAdmin.pages');

app.factory('AuthInterceptor', function ($window, $q, localStorage, $rootScope) {
  $rootScope.pendingRequests = 0;
  return {
    request: function(config) {
      $rootScope.showLoader = true;
      $rootScope.pendingRequests++;
      config.headers = config.headers || {};
      if(localStorage.getObject('token')) {
        config.headers.Authorization = "JWT "+localStorage.getObject('token');
      }
      return config || $q.when(config);
    },
    response: function(response) {
      checkDigestCycle();
      return response;
    },
    requestError: function(rejection) {
      checkDigestCycle();
      return $q.reject(rejection);
    },
    responseError: function(rejection) {
      checkDigestCycle();
      return $q.reject(rejection);
    },
  };

  function checkDigestCycle(){
    $rootScope.pendingRequests--;
    if($rootScope.pendingRequests == 0){
      $rootScope.showLoader = false;
    }
  }
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
