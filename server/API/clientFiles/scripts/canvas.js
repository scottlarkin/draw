(function(){
    'use strict'

    var socket = io('http://localhost:7000');
        
    socket.on('updatedPixels', function(data){
        data.forEach(function(pixel){
            drawPixel(pixel[0], pixel[1], 0,0,0, 255);
        });

        ctx.putImageData(canvasData, 0, 0);

    });

    var mouseDown = false;
    var mousePosOld;
    var mousePos;
    var canvas = $('#myCanvas');

    var canvasWidth = canvas[0].width;
    var canvasHeight = canvas[0].height;
    var ctx = canvas[0].getContext("2d");
    var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    function drawPixel (x, y, r, g, b, a) {
        var index = (x + y * canvasWidth) * 4;
        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = a;
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();        
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvas.mousedown(function(e){
        mouseDown = true;
        mousePos = getMousePos(canvas[0], e);
        mousePosOld = mousePos;
    });

    canvas.mouseup(function(e){
        mouseDown = false;
    });

    canvas.mousemove(function(e){
        if(mouseDown){
            
            mousePos = getMousePos(canvas[0], e);
        }
    });

    function vecLerp(x1,y1,x2,y2,t){
        return {
            x: (x1*t) + (x2*(1-t)),
            y: (y1*t) + (y2*(1-t))
        }
    }

    (function(){

        var dims = 30;
        var dimsSqr = dims*dims; //sqr this here so i dont have to sqrt a vector length later

        setInterval(function(){ 
            
            if(mouseDown){

            //let the server know what kind of brush is being used and which pixels are hit by it
            var changes = {
                pixels:[],
                brushType: 0,
                brushSize: dims
            }

            var pixels = changes.pixels;
            var xd = Math.abs(mousePos.x - mousePosOld.x);
            var yd = Math.abs(mousePos.y - mousePosOld.y);
            var len = (xd*xd) + (yd*yd);
            var step = 1/(len/dimsSqr);

            //linear interpolation to fill in any gaps between mouse position since last update
            for(var l = 0; l < 1; l+= step){
                            
                var newVec = vecLerp(mousePos.x, mousePos.y, mousePosOld.x, mousePosOld.y, l);

                //bit shifting by 0 simply to remove the decimal part of the number.
                var x = (newVec.x >> 0);
                var y = (newVec.y >> 0);

                pixels.push([x, y, 1]);

                //fill in a square around the mouse position
                for(var i = -dims/2; i < dims/2; i++){
                    for(var j = -dims/2; j < dims/2; j++){
                        drawPixel(x + i, y + j, 0,255,0, 255);
                    }
                }
            }
            
            socket.emit('updateCanvas', { canvas:0, changes: changes});
                ctx.putImageData(canvasData, 0, 0);
                mousePosOld = mousePos;
            }
            
        }, 30);

    })();

})();