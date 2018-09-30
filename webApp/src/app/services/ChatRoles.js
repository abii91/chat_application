
(function () {
  'use strict';

  angular.module('BlurAdmin.services')
    .service('ChatRoles', ChatRoles);

    function ChatRoles(){
        return{
            super_admin: 1,
            group_admin: 2,
            users: 3
        }
    }

})();
