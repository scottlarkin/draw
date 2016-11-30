 
(function(){

    'use strict'

    var express = require('express');
    var rabbit = require('./rabbit.js');

    var app = express();
    app.use(express.static('clientFiles'));
    app.use('/clientFiles', express.static('clientFiles'));

    app.listen(80, () => {
        console.log('listening on port 80');
    });

    app.get('/home',(req, res) => {
        
        res.sendFile('clientFiles/index.html', { root: __dirname });
        
    });

    app.get('/getAvailableService/:canvasId', (req, res) => {

        rabbit.sendMessage('getAvailableCanvasService', req.params.canvasId, msg => res.send(msg));

    });

})();