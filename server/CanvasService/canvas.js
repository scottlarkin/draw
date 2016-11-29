(function(){

    'use strict'

    var brushFunctions = {
        0 : squareBrush
    }

    var canvasPartitionSize = 10;
    var useTransparencyChannel = false;
    var pixelByteSize = useTransparencyChannel ? 4 : 3;

    exports.Canvas2 = function(id, width, height){

        var ret = {
            'id': id,
            'width': width,
            'height': height,
            'canvas': (()=>{

                var arr = [];

                let w = width / canvasPartitionSize;
                let h = height / canvasPartitionSize;

                for(let i = 0; i < canvasPartitionSize; i++){
                    arr.push([]);

                    for(let j = 0; j < canvasPartitionSize; j++){
                        var arrBuffer = new ArrayBuffer(w * h * pixelByteSize);
                        arr[y].push({live: false, buffer: arrBuffer, view: new Uint8Array(arrBuffer)});
                    }
                }

                return arr;
            })()
        };
        return ret;
    };

    function GetDirtyViews(canvas){

        var ret = [];

        for(let i = 0; i < canvasPartitionSize; i++){
            for(let j = 0; j < canvasPartitionSize; j++){

                 var c = canvas.canvas[i][j];

                if(c.live){
                   ret.push({x: i, y: j, data: c.buffer});
                }

            }
        }

        return ret;
    }

    function GetP(canvas, x, y){

        //find the canvas segment which holds the requested pixel
        let w = canvas.width / canvasPartitionSize;
        let h = canvas.height / canvasPartitionSize;
        let i = (x / w) << 0;
        let j = (y / h) << 0;
        
        var view = canvas.canvas[i][j].view;

        //find the pixel within the segment and return
        let sx = i * w;
        let sy = j * h;
        let p0 = (w * (y-sy) + (x-sx)) * pixelByteSize;


        return {
            r: view[p0++],
            g: view[p0++],
            b: view[p0]
        };

    }

    exports.Canvas = function(id, width, height){

        var ret = {
            'id': id,
            'width': width,
            'height': height,
            'canvas': []
        };

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