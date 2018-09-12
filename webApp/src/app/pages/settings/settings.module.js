/**
 * *
 * created on 04.12.2017
*/

(function() {
  'use strict';

  angular.module('BlurAdmin.pages.settings', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('main.settings', {
        url: '/settings',
        templateUrl: 'app/pages/settings/settings.html',
        title: 'Groups',
        controller: 'settingsCtrl',
        sidebarMeta: {
          icon: 'ion-gear-b',
          order: 104,
        },
        data: {
          permissions: {
            only: ['super_admin', 'group_admin']
          }
        },
        authenticate: true
      });
  }

})();
