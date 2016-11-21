
(function(){
    
    'use strict'
    
    angular.module('draw')
    .controller('sidebarController', function($scope, brushService) {
       
       function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

       $scope.changeBrushColour = function(){
           brushService.brushColourHex = $scope.brushColour;
           brushService.brushColour = hexToRgb($scope.brushColour)
       };

    });

})();