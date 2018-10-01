/**
* @author sara.iftikhar
* created on 11.09.2018
*/

var myApp = angular.module('BlurAdmin.dirrectives');


myApp.directive('fileUpload', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      console.log(attrs.fileUpload);
      console.log(element);
      var model = $parse(attrs.fileUpload);
      var modelSetter = model.assign;
      element.bind('change', function(){
        scope.$apply(function(){
          console.log("$apply");
          console.log(element);
          console.log(scope);
          modelSetter(scope.$parent, element[0].files[0]);
        });
      });
    }
  };
}]);
