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
        
        console.log('New canvas created, ID: ' + id);

        return ret;
    };

    function squareBrush(canvas, brushSize, brushColour, updatePixels){

        return function(pixel){

            for(var i = -brushSize; i < brushSize; i++){
                let x = pixel[0] + i;
                for(var j = -brushSize; j < brushSize; j++){
                    let y =  pixel[1] + j;
                    exports.setPixel(canvas, x, y, brushColour);
                    updatePixels.push([x, y, brushColour]);
                }
            }
        }
    }

    function init(canvas){
    
        let white = (255 << 16) + (255 << 8) + 255;

        for(var y = 0; y < canvas.height; y++){

            canvas.canvas.push([]);
            for(var x = 0; x < canvas.width; x++){

                canvas.canvas[y].push(white);
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
        let colour = data.changes.brushColour;

        var updatePixels = [];

        let brush = brushFunctions[brushType](canvas, brushSize, colour, updatePixels);
        
        //update the internal state of the canvas
        pixels.forEach( pixel => {
            brush(pixel);
        });

        return {colour: colour, pixels: updatePixels};
    }

})();