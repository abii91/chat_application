/**
 * Created by ibtesam.latif
 * on 13.12.2017.
 */
(function(){
    'use strict';

    var loyalty = angular.module('BlurAdmin.pages.settings');

    loyalty.directive("groups", groups);

    function groups() {
        return {
            templateUrl : "app/pages/settings/groups/groups.html",
            controller : 'groupsCtrl',
        };
    }

})();
