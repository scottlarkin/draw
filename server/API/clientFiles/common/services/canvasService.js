(function(){

    'use strict'

    angular.module('draw')
    .service('canvasService', function(socketInterfaceService){

        function drawPixel (x, y, r, g, b, a) {
            var index = (x + y * cs.canvasWidth) * 4;
            cs.canvasData.data[index + 0] = r;
            cs.canvasData.data[index + 1] = g;
            cs.canvasData.data[index + 2] = b;
            cs.canvasData.data[index + 3] = a;
        }

        function vecLerp(x1,y1,x2,y2,t){
            return {
                x: (x1*t) + (x2*(1-t)),
                y: (y1*t) + (y2*(1-t))
            }
        }

        function startCanvas(){

            socketInterfaceService.emitMessage('joinCanvas', {canvas: 0});

            //tell the socket interface what to do when it gets the message 'updatedPixels'
            socketInterfaceService.registerResponse('updatedPixels', function(data){

                data.forEach(function(pixel){
                    drawPixel(pixel[0], pixel[1], 0,0,0, 255);
                });

                cs.ctx.putImageData(cs.canvasData, 0, 0);
            });

            var dims = 6;
            var dimsSqr = dims*dims; //sqr this here so i dont have to sqrt a vector length later

            setInterval(function(){ 
                
                if(cs.mouseDown){

                    //todo- move this out of canvas service... brush.js?

                    //let the server know what kind of brush is being used and which pixels are hit by it
                    var changes = {
                        pixels:[],
                        brushType: 0,
                        brushSize: dims
                    }

                    var pixels = changes.pixels;
                    var xd = Math.abs(cs.mousePos.x - cs.mousePosOld.x);
                    var yd = Math.abs(cs.mousePos.y - cs.mousePosOld.y);
                    var len = (xd*xd) + (yd*yd);
                    var step = 1/(len/dimsSqr);

                    //linear interpolation to fill in any gaps between mouse position since last update
                    for(var l = 0; l < 1; l+= step){
                                    
                        var newVec = vecLerp(cs.mousePos.x, cs.mousePos.y, cs.mousePosOld.x, cs.mousePosOld.y, l);

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
                    
                    socketInterfaceService.emitMessage('updateCanvas',{ canvas:0, changes: changes});
                    cs.ctx.putImageData(cs.canvasData, 0, 0);
                    cs.mousePosOld = cs.mousePos;
                }
            
            }, 15);

        };

        

        var cs = {};

        cs.mouseDown;
        cs.mousePos;
        cs.mousePosOld;
        
        var loading = true;

        cs.init = function(){
            loading = false;
            startCanvas();
            console.log('started');
        }

        cs.setCanvas = function(canvas){
            cs.canvas = canvas;
            cs.canvasWidth = canvas[0].width;
            cs.canvasHeight = canvas[0].height;
            cs.ctx = canvas[0].getContext("2d");
            cs.canvasData = cs.ctx.getImageData(0, 0, cs.canvasWidth, cs.canvasHeight);
        }

        return cs;
    });

})();