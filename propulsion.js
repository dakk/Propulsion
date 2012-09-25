var propulsion;

(function() {
    "use strict";

    if (typeof Object.create !== 'function') {
        (function() {
            var F = function() {};
            Object.create = function(obj) {  
                F.prototype = obj;
                return new F();
            };
        }());
    }

    propulsion = function(canvas, callback, width, height, displayWidth, displayHeight) {
        var PP = {
            displayCanvas: {
                canvas: canvas,
                ctx: canvas.getContext('2d'),
                width: width,
                height: height,
                displayWidth: displayWidth,
                displayHeight: displayHeight
            }
        };

        if (displayWidth !== undefined) {
            canvas.style.width = displayWidth+'px';
        }

        if (displayHeight !== undefined) {
            canvas.style.height = displayHeight+'px';
        }

        canvas.width = width;
        canvas.height = height;

        var i,
            modules = propulsion.modules,
            mlen = modules.length;

        for (i = 0; i < mlen; i++) {
            modules[i](PP);
        }

        callback(PP);
        return PP;
    };

    propulsion.modules = [];
}());