
(function(){
    
    'use strict'
    
    angular.module('draw')
    .directive('myCanvas', function(canvasService){

        return {
            restrict: 'E',
            templateUrl: 'components/canvas/canvas.tpl.html',
            replace: 'true',
            controller: 'canvasController',
            link: function(scope, elem, attr){
                canvasService.setCanvas(elem);
            }
        };

    });

})();


