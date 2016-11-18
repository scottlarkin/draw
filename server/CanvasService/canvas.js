(function(){

    'use strict'

    function Canvas(id, width, height){

        return {

            'id': id,
            'width': width,
            'height': height,
            canvas: []
        }
    }

    var canvases = [];

    function init(canvasId){

        let canvasObj = canvases[canvasId];
        let canvas = canvasObj.canvas;

        for(var y = 0; y < canvasObj.height; y++){

            canvas.push([]);
            for(var x = 0; x < canvasObj.width; x++){

                canvas[y].push(0);
            }
        }
    }

    canvases.push(new Canvas(canvases.length, 1920, 1080 ));
    init(0);

    //exports
    exports.setPixel = function(canvasId, x, y, val){
        return canvases[canvasId].canvas[y][x] = val;
    }

    exports.getPixel = function(canvasId, x,y){
        return canvases[canvasId].canvas[y][x];
    }
})();