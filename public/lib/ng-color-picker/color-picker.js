angular.module('ngColorPicker', [])
.provider('ngColorPickerConfig', function(){

    var templateUrl = 'lib/ng-color-picker/color-picker.html';
    var defaultColors =  [
        '#7bd148',
        '#5484ed',
        '#46d6db',
        '#7ae7bf',
        '#51b749',
        '#fbd75b',
        '#ffb878',
        '#ff887c',
        '#dc2127',
        '#dbadff',
        '#000000',
        '#e1e1e1'
    ];
    this.setTemplateUrl = function(url){
        templateUrl = url;
        return this;
    };
    this.setDefaultColors = function(colors){
        defaultColors = colors;
        return this;
    };
    this.$get = function(){
        return {
            templateUrl : templateUrl,
            defaultColors: defaultColors
        };
    };
})
.directive('ngColorPicker', ['$rootScope','ngColorPickerConfig',function($rootScope, ngColorPickerConfig) {

    return {
        scope: {
            selected: '=',
            customizedColors: '=colors'
        },
        restrict: 'AE',
        templateUrl: ngColorPickerConfig.templateUrl,
        link: function (scope, element, attr) {
            scope.colors = scope.customizedColors || ngColorPickerConfig.defaultColors;
            scope.selected = scope.selected || scope.colors[0];

            scope.pick = function (color) {
                scope.selected = color;
                // broadcast global message with new selected colour
                $rootScope.$broadcast('newSelectedColour', scope.selected);
            };

        }
    };

}]);
