(function() {
  'use strict';

  angular.module('BlurAdmin.pages.myGroups', ['BlurAdmin.pages.channelDetails'])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('main.myGroups', {
      url: '/myGroups',
      templateUrl: 'app/pages/myGroups/myGroups.html',
      title: 'My Groups',
      controller: 'myGroupsCtrl',
      sidebarMeta: {
        icon: 'ion-person',
        order: 98,
      },
      data: {
        permissions: {
          only: ['users']
        }
      },
      authenticate: true
    });
  }

})();
