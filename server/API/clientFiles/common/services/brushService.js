(function(){

    'use strict'

    angular.module('draw')
    .service('brushService', function(){

        var brushes = {

            0: function(callback){
                //square brush
                return function(x, y){
                    var dims = bs.brushSize / 2;
                    for(var i = -dims; i < dims; i++){
                        for(var j = -dims; j < dims; j++){
                            callback(x + i, y + j, bs.brushColour.r, bs.brushColour.g, bs.brushColour.b, 255);
                        }
                    }
                }
            }

        };

        var bs = {};

        bs.brushType = 0;
        bs.brushSize = 6;
        bs.brushColour = {r:0, g:0, b:0};
        bs.brushColourHex = 0x000;

        bs.getBrush = function(type, callback){

            return brushes[type](callback);

        }

        return bs;
    });

})();