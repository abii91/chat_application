/**
 * Created by ibtesam.latif
 * on 30.03.2018
 */
(function(){
    'use strict';

    var loyalty = angular.module('BlurAdmin.pages.settings');

    loyalty.directive("channels", channels);

    function channels() {
        return {
            templateUrl : "app/pages/settings/channel/channel.html",
            controller : 'channelsCtrl',
        };
    }

})();
