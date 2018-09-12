(function() {
  'use strict';

  angular.module('BlurAdmin.pages.users', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('main.users', {
        url: '/users',
        templateUrl: 'app/pages/users/users.html',
        title: 'Users',
        controller: 'usersCtrl',
        sidebarMeta: {
          icon: 'ion-person',
          order: 102,
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
