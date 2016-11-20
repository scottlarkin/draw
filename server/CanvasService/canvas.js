(function(){

    'use strict'

    var brushFunctions = {
        0 : squareBrush
    }

    exports.Canvas = function(id, width, height){

        var ret = {
            'id': id,
            'width': width,
            'height': height,
            'canvas': []
        }

        init(ret);
    
        return ret;
    };

    function squareBrush(canvas, brushSize, updatePixels){

        return function(pixel){

            for(var i = -brushSize; i < brushSize; i++){
                let x = pixel[0] + i;
                for(var j = -brushSize; j < brushSize; j++){
                    let y =  pixel[1] + j;
                    exports.setPixel(canvas, x, y, pixel[2]);
                    updatePixels.push([x, y, pixel[2]]);
                }
            }
        }
    }

    function init(canvas){
        console.log(canvas);
        for(var y = 0; y < canvas.height; y++){

            canvas.canvas.push([]);
            for(var x = 0; x < canvas.width; x++){

                canvas.canvas[y].push(0);
            }
        }
    }

    //exports
    exports.setPixel = function(canvas, x, y, val){
        return canvas.canvas[y][x] = val;
    }

    exports.getPixel = function(canvasId, x,y){
        return canvases[canvasId].canvas[y][x];
    }

    exports.updateCanvas = function(data){

        let canvas = data.canvas;
        let pixels = data.changes.pixels;
        let brushType = data.changes.brushType;
        let brushSize = data.changes.brushSize * 0.5;

        var updatePixels = [];

        let brush = brushFunctions[brushType](canvas, brushSize, updatePixels);
        
        //update the internal state of the canvas
        pixels.forEach( pixel => {
            brush(pixel);
        });

        return updatePixels;
    }

})();