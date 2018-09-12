/**
 * Created by ibtesam.latif
 * Created on 05.01.2018.
 */
(function(){
    'use strict';

    var loyalty = angular.module('BlurAdmin.pages.users');

    loyalty.directive("usersList", usersList);

    function usersList() {
        return {
            templateUrl : "app/pages/users/usersList/usersList.html",
            scope: {
                users: "=",
                rowList: "=",
                tab: "@"
            }
        };
    }

})();
