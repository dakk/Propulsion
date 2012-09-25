propulsion.modules.push(function(PP) {
    "use strict";
    PP.view = {
        viewsList: [],

        proto: {
            portPosition: PP.vector.create(0, 0),

            draw: function() {
                var ctx = PP.displayCanvas.ctx,
                    pos = this.portPosition;
                ctx.drawImage(this.canvas, pos.x, pos.y, this.portWidth, this.portHeight);
            },

            clear: function() {
                var ctx = this.ctx;
                // Store the current transformation matrix
                ctx.save();

                // Use the identity matrix while clearing the canvas
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.restore();
            }
        },

        create: function(position, width, height, portPosition, portWidth, portHeight) {
            if (portWidth === undefined) {
                portWidth = width;
            }

            if (portHeight === undefined) {
                portHeight = height;
            }
            
            var newView = Object.create(PP.view.proto),
                canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            newView.position = position;
            newView.width = width;
            newView.height = height;

            if (portPosition !== undefined) {
                newView.portPosition = portPosition;
            }
            
            newView.portWidth = portWidth;
            newView.portHeight = portHeight;
            newView.canvas = canvas;
            newView.ctx = canvas.getContext('2d');
            newView.mousePosition = PP.vector.create(0, 0);
            return newView;
        },

        register: function(view) {
            PP.view.viewsList.push(view);
            PP.draw.refreshProperties(view.ctx);
            return view;
        },

        remove: function(view) {
            var i,
                viewsList = PP.view.viewsList,
                len = viewsList.length;

            for (i = 0; i < len; i++) {
                if (viewsList[i] === view) {
                    viewsList.splice(i, 1);
                    return view;
                }
            }
        },

        draw: function() {
            var i,
                viewsList = PP.view.viewsList,
                vlen = viewsList.length;

            for (i = 0; i < vlen; i++) {
                viewsList[i].draw();
            }
        }
    };

    PP.draw.resetTargets();
});