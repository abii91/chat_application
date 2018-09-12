/**
 * *
 * created on 31.01.2018
*/

(function(){
    'use strict';

    var cities = angular.module('BlurAdmin.pages.settings');

    cities.directive("selectableList", selectableList);

    function selectableList(){
        return {
            templateUrl : "app/pages/settings/selectableList/selectableList.html",
            scope: {
              records: '=',
              recordList: '=',
              module: '@'
            }
        };
    }

})();
