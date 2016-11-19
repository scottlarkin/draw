 
 (function(){

    'use strict'

    var express = require('express');
    var app = express();
    app.use(express.static('clientFiles'));
    app.use('/clientFiles', express.static('clientFiles'));

    app.listen(3000, function(){

        console.log('listening on port 3000');

    });

    app.get('/home', function(req, res){
        res.sendFile('clientFiles/index.html', { root: __dirname });
    });

 })()