(function(){

    'use strict'

    var brushFunctions = {
        0 : squareBrush
    }

    function Canvas(id, width, height){

        return {

            'id': id,
            'width': width,
            'height': height,
            canvas: []
        }
    }

    var canvases = [];

    function squareBrush(canvasId, brushSize, updatePixels){

        return function(pixel){

            for(var i = -brushSize; i < brushSize; i++){
                let x = pixel[0] + i;
                for(var j = -brushSize; j < brushSize; j++){
                    let y =  pixel[1] + j;
                    exports.setPixel(canvasId, x, y, pixel[2]);
                    updatePixels.push([x, y, pixel[2]]);
                }
            }
        }
    }

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

    exports.updateCanvas = function(data){

        let canvasId = data.canvas;
        let pixels = data.changes.pixels;
        let brushType = data.changes.brushType;
        let brushSize = data.changes.brushSize * 0.5;

        var updatePixels = [];

        let brush = brushFunctions[brushType](canvasId, brushSize, updatePixels);
        
        //update the internal state of the canvas
        pixels.forEach( pixel => {
            brush(pixel);
        });

        return updatePixels;

    }

})();