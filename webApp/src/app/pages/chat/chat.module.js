(function() {
  'use strict';

  angular.module('BlurAdmin.pages.chat', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('main.chat', {
      url: '/chat',
      templateUrl: 'app/pages/chat/chat.html',
      title: 'Chat',
      sidebarMeta: {
        icon: 'ion-person',
        order: 100,
      },
      data: {
        permissions: {
          only: ['super_admin', 'group_admin', 'users']
        }
      },
      authenticate: true
    });
  }

})();
