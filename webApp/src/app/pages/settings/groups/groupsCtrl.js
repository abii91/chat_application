/**
 * Created by ibtesam.latif
 * on 13.12.2017.
 */
(function(){
    'use strict';

    var loyalty = angular.module('BlurAdmin.pages.settings');

    loyalty.controller("groupsCtrl", groupsCtrl);

    function groupsCtrl($scope, settingService, generalHelper, generalFactory, channelsService, $http, $uibModal, editableOptions, editableThemes, config) {

        var modal_options;
        $scope.smartTablePageSize = 10;
        $scope.groups = [];
        $scope.selectedGroup = null;

        getGroups();

        function getGroups() {
            generalFactory.request("groups")
           .then(function(response){
               if(response.code == 'OK'){
                    $scope.rowList = response.data;
                    $scope.groups = [].concat($scope.rowList);
               }
           });
        }

        $scope.addGroup = function() {
            $scope.inserted = {
                name: "",
            };
            $scope.groups.push($scope.inserted);
        };

        $scope.removeGroup = function(index) {
          generalHelper.showConfirmAlert("Are you sure you want to remove this group?", function(){
            if($scope.groups[index].id) {
              $http({
                  method: "DELETE",
                  url: config.baseUrl+"/groups/"+$scope.groups[index].id
              })
              .then(function(response){
                  var response_data = response.data;
                  if(response_data.code == 'OK'){
                      $scope.groups.splice(index, 1);
                      $scope.selectedGroup = null;
                  }
              });
             }
          });
        };

        $scope.saveGroup = function(group, index) {
            var api_method, api_url;

            if($scope.groups[index].id){
                api_method = "PUT";
                api_url = config.baseUrl+"/groups/"+$scope.groups[index].id;
                group.id = $scope.groups[index].id;
            }
            else{
                api_method = "POST";
                api_url = config.baseUrl+"/groups";
            }
            $http({
                method: api_method,
                url: api_url,
                data: group
            })
            .then(function(response){
                var response_data = response.data;
                if(response_data.code == 'CREATED' || response_data.code == 'OK'){
                    getGroups();
                    if(response_data.code == 'CREATED'){
                        generalHelper.showSuccessMessage("New group has been added successfully.")
                    }
                    if(response_data.code == 'OK'){
                        generalHelper.showSuccessMessage("Group has been modified successfully.");
                    }
                }
            });
        };

        $scope.validateGroup = function(group, evnt) {
            if( group.name && group.name != "" ){
                $scope.invalidGroupName = false;
                evnt.target.style.borderColor = '';
            }
            else{
                $scope.invalidGroupName = true;
                evnt.target.style.borderColor = 'red';
            }
        }


        $scope.selectGroup = function(group) {
          $scope.selectedGroup = group;
          getChannels();
        };

        function getChannels () {
          channelsService.getGroupChannels($scope, $scope.selectedGroup.id);
        };

        $scope.addChannels = function () {
            modal_options = {
              templateUrl: 'app/pages/settings/groups/addChannel/addChannel.html',
              controller: 'addChannelCtrl',
                scope: $scope,
                resolve: {
                    group: function () {
                        return $scope.selectedGroup;
                    }
                }
            };
            generalHelper.launchModal(modal_options, getChannels);
        };

        $scope.removeChannels = function () {
            var channel_ids = [];

            generalHelper.showConfirmAlert("Are you sure you want to remove these channels?", function(){
                $scope.groupChannels.forEach(function(channel){
                    if(channel.selected){
                        channel_ids.push(channel.id);
                    }
                });
                $http({
                    method: "POST",
                    url: encodeURI(config.baseUrl+"/channels/removeGroupChannels"),
                    data: {channels: channel_ids}
                })
                .then(function(response){
                     var response_data = response.data;
                     if(response_data.code == 'OK'){
                        getChannels();
                     }
                 });
            });

        };


        $scope.cancelGroup = function(rowform, index){
          if(null == $scope.groups[index].id)
            $scope.groups.splice(index, 1);

          rowform.$cancel();
        };


        $scope.$on('$destroy', function() {
            $("#chat_danger_alert").hide();
            $("#chat_success_alert").hide();
        });
    }

})();
