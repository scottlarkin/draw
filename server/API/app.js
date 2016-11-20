 
 (function(){

    'use strict'

    var express = require('express');
    var rabbit = require('./rabbit.js');

    var app = express();
    app.use(express.static('clientFiles'));
    app.use('/clientFiles', express.static('clientFiles'));

    app.listen(3000, () => {
        console.log('listening on port 3000');
    });

    app.get('/home',(req, res) => {
        res.sendFile('clientFiles/index.html', { root: __dirname });
    });

    app.get('/getAvailableService', (req, res) => {

        rabbit.sendMessage('queue', '', msg => res.send(msg));
        
    });

 })()