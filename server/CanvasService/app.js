(function(){

    'use strict'

    var socket = require('./socket.js');
    var canvas = require('./canvas.js');

    var canvasClients = {};
    var clientCanvas = {};

    function createCanvas(canvasID){

        //todo, allow dynamic canvas size, get from client web page
        var c = new canvas.Canvas(canvasID, 1500, 900 );
        c.clients = [];
        canvasClients[canvasID] = c;
    }

    socket.registerResponse('updateCanvas', (s) => {

        return (data) => {

            let canvasId = data.canvas;

            data.canvas = canvasClients[canvasId];
            
            //only send updated pixels to clients in the same canvas instance
            s.broadcast.to(canvasId).emit('updatedPixels', canvas.updateCanvas(data));
        }
    });

    socket.registerResponse('joinCanvas', (s) => {

        return (data) => {
            
            if(!canvasClients[data.canvas]){
                createCanvas(data.canvas);
            }

            canvasClients[data.canvas].clients.push(s);
            clientCanvas[s.id] = data.canvas;
            s.join(data.canvas);
            
            //send the current state of the canvas to the client
            s.emit('canvasData', canvasClients[data.canvas].canvas);
        }
    });

    socket.registerResponse('disconnect', (s) => {
        
        return () => {
            
            var c = clientCanvas[s.id];

            if(typeof(c) != 'undefined' && c != null){

                console.log('client disconnected');

                var index = canvasClients[c].clients.indexOf(s);

                if (index != -1) {
                    
                    var clients = canvasClients[c].clients;

                    clients.splice(index, 1);

                    if(!clients.length){
                        console.log('All clients disconnected from canvas: ' + c + '... Deleting canvas');
                        delete canvasClients[c];
                    }

                }

                delete clientCanvas[s.id];
            }

        }

    });

})();

