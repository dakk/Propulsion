propulsion.modules.push(function(PP) {
    "use strict";
    PP.surface = {
        proto: {
            position: PP.vector.create(0, 0),

            // TODO!!
            draw: function(x, y) {
                return;
            }
        }

        create: function(width, height) {
            var newSurface = Object.create(proto),
                canvas = document.createElement('canvas');

            canvas.width = width;
            canvas.height = height;
            newSurface.width = width;
            newSurface.height = height;
            newSurface.canvas = canvas;
            newSurface.ctx = canvas.getContext('2d');
            return newSurface;
        }
    };
});