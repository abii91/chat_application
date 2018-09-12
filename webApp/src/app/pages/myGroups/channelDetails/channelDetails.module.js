(function() {
  'use strict';

  angular.module('BlurAdmin.pages.channelDetails', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('main.channelDetails', {
      url: '/channel/:id/details',
      templateUrl: 'app/pages/myGroups/channelDetails/channelDetails.html',
      title: 'Channel details',
      data: {
        permissions: {
          only: ['users']
        }
      },
      authenticate: true
    });
  }

})();
