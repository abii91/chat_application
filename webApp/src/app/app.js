'use strict';

angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'permission',
  'permission.ui',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-progress-button-styles',
  'btford.socket-io',

  'BlurAdmin.theme',
  'BlurAdmin.pages',
  'BlurAdmin.services',
  'BlurAdmin.dirrectives',
  'ct.ui.router.extras.core'
])
.run(function (PermRoleStore, localStorage, config) {
    var current_user = localStorage.getObject('dataUser');
    if(current_user.hasOwnProperty("role_id") && current_user.role_id.hasOwnProperty("role_name")){
      PermRoleStore
      .defineRole(current_user.role_id.role_name, []);
      var roles = PermRoleStore.getStore();
    }
});
