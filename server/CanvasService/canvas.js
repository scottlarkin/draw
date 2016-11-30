(function(){

    'use strict'

    var brushFunctions = {
        0 : squareBrush
    }

    //canvasWidth and canvasHeight must be evenly divisible by canvasPartitionSize!!
    const canvasPartitionSize = 10;
    const useTransparencyChannel = false;
    const pixelByteSize = useTransparencyChannel ? 4 : 3;
    const canvasWidth = 1500;
    const canvasHeight = 900;
    const w = canvasWidth / canvasPartitionSize;
    const h = canvasHeight / canvasPartitionSize;

    function SetP(canvas, x, y, r, g, b){
        
        if(x < 0) return;
        if(x > canvasWidth-1) return;
        if(y < 0) return;
        if(y > canvasHeight-1) return;

        let i = (x / w) << 0;
        let j = (y / h) << 0;
        let sx = i * w;
        let sy = j * h;

        var segment = canvas.canvas[i][j];
        var view = segment.view;
        segment.live = true;

        let p0 = (w * (y-sy) + (x-sx)) * pixelByteSize;

        view[p0++] = r;
        view[p0++] = g;
        view[p0] = b;

    }

    //get a pixel colour at a specific position on a canvas
    function GetP(canvas, x, y){

        let i = (x / w) << 0;
        let j = (y / h) << 0;
        let sx = i * w;
        let sy = j * h;
        
        var view = canvas.canvas[i][j].view;

        let p0 = (w * (y-sy) + (x-sx)) * pixelByteSize;

        return {
            r: view[p0++],
            g: view[p0++],
            b: view[p0]
        };
    }

    //fill in a square with a length of brushSize around the given pixel position
    function squareBrush(canvas, brushSize, brushColour, updatePixels){
        
        let r = (brushColour >> 16) & 0xFF;
        let g = (brushColour >> 8) & 0xFF;
        let b = brushColour & 0xFF;

        return (pixel) => {            

            for(let i = -brushSize; i < brushSize; i++){
                let x = pixel[0] + i;
                for(let j = -brushSize; j < brushSize; j++){
                    let y =  pixel[1] + j;

                    SetP(canvas, x, y, r, g, b);
                    
                    updatePixels.push([x, y]);
                }
            }

        }
    }

    /* EXPORTS */
    exports.Canvas = function(id){

        var ret = {
            'id': id,
            'canvas': (()=>{

                let arr = [];

                let byteCount = w * h * pixelByteSize;

                for(let i = 0; i < canvasPartitionSize; i++){
                    arr.push([]);

                    for(let j = 0; j < canvasPartitionSize; j++){

                        var arrBuffer = new ArrayBuffer(byteCount);
                        var bufferView = new Uint8Array(arrBuffer);

                        //init all pixels to their max value
                        for(let n = 0; n < byteCount; n++){
                            bufferView[n] = 0xFF;
                        }

                        arr[i].push({live: false, buffer: arrBuffer, view: bufferView});
                    }
                }

                return arr;
            })()
        };

        console.log('New canvas created, ID: ' + id);

        return ret;
    };

    //returns a list of canvas segments which have been changed
    exports.GetDirtyViews = (canvas) => {

        let ret = [];

        for(let i = 0; i < canvasPartitionSize; i++){
            for(let j = 0; j < canvasPartitionSize; j++){

                let c = canvas.canvas[i][j];

                if(c.live){
                   ret.push({x: i, y: j, data: c.buffer});
                }
            }
        }

        return ret;
    }

    //use data from clients to update the internal state of the canvases
    exports.updateCanvas = (data) => {

        let canvas = data.canvas;
        let pixels = data.changes.pixels;
        let brushType = data.changes.brushType;
        let brushSize = data.changes.brushSize * 0.5;
        let colour = data.changes.brushColour;
        let updatePixels = [];
        let brush = brushFunctions[brushType](canvas, brushSize, colour, updatePixels);
        
        //update the internal state of the canvas
        pixels.forEach( pixel => {
            brush(pixel);
        });

        //the returned data is broadcast to the other clients
        return {colour: colour, pixels: updatePixels};
    };

})();