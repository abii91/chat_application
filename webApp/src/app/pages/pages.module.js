/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages', [
      'ui.router',
      'BlurAdmin.pages.config',
      'BlurAdmin.pages.main',
      'BlurAdmin.pages.myGroups',
      'BlurAdmin.pages.users',
      'BlurAdmin.pages.profile',
      'BlurAdmin.pages.settings',
      'BlurAdmin.pages.chat',
      'BlurAdmin.pages.authSignIn',
      'BlurAdmin.pages.authSignUp',
    ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/authSignIn');
  }

})();
