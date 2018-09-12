/**
 * @author ibtesam.latif
 * Created on 05.01.2018.
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.services')
    .service('OBTechRoles', OBTechRoles);

    function OBTechRoles(){
        return{
            super_admin: 1,
            group_admin: 2,
            users: 3
        }
    }

})();
