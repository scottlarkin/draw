
(function(){
    
    'use strict'
    
    angular.module('draw')
    .controller('canvasController', ['$scope', 'canvasService', function($scope, canvasService) {
       
        $scope.canvasClicked = function(e){
            canvasService.mouseDown = true;
            canvasService.mousePos = {x: e.offsetX, y: e.offsetY};
            canvasService.mousePosOld = canvasService.mousePos;
        }

        $scope.mouseReleased = function(){
            canvasService.mouseDown = false;
        };

        $scope.mouseMoved = function(e){
            if(canvasService.mouseDown){
                canvasService.mousePos = {x: e.offsetX, y: e.offsetY};
            }
        };

    }]);

})();