propulsion.modules.push(function(PP) {
    var propertiesList = [];

    PP.draw = {
/**
    name: PP.draw.rectangle
    desc: Draws a rectangle at the given position with the specified width and height
    arg: num x x position to draw at
    arg: num y y position to draw at
    arg: type name description
**/
        targets: [],

        resetTargets: function() {
            PP.draw.targets = PP.view.viewsList;
        },

        rectangle: function(x, y, width, height, stroke) {
            var i, target, xx, yy, pos,
                targets = PP.draw.targets,
                len = targets.length;

            for (i = 0; i < len; i++) {
                target = targets[i];
                pos = target.position;
                xx = x - pos.x;
                yy = y - pos.y;

                if (stroke) {
                    target.ctx.strokeRect(xx, yy, width, height);
                } else {
                    target.ctx.fillRect(xx, yy, width, height);
                }
            }

            return this;
        },

        circle: function(x, y, radius, stroke) {
            var i, target, xx, yy, pos, ctx,
                targets = PP.draw.targets,
                len = targets.length;

            for (i = 0; i < len; i++) {
                target = targets[i];
                pos = target.position;
                xx = x - pos.x;
                yy = y - pos.y;
                ctx = target.ctx;
                ctx.beginPath();
                ctx.arc(xx, yy, radius, 0, 6.283185307179586);
                if (stroke) {
                    ctx.stroke();
                } else {
                    ctx.fill();
                }
            }

            return this;
        },

        text: function() {
            var i, target, xx, yy, pos, ctx,
                rotated = false,
                targets = PP.draw.targets,
                len = targets.length;

            for (i = 0; i < len; i++) {
                target = targets[i];
                pos = target.position;
                xx = x - pos.x;
                yy = y - pos.y;
                ctx = target.ctx;

                if (angle !== undefined && angle !== 0) {
                    rotated = true;
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    xx = 0;
                    yy = 0;
                }

                if (maxWidth === undefined) {
                    ctx.fillText(text, xx, yy);
                } else {
                    ctx.fillText(text, xx, yy, maxWidth);
                }

                if (rotated) {
                    ctx.restore();
                }
            }

            return this;
        },

        measureText: function(text) {
            var targets = PP.draw.targets;

            if (targets.length !== 0) {
                return targets[0].ctx.measureText(text);
            }

            return null;
        },

        refreshProperties: function(ctx) {
            var i,
                len = propertiesList.length;

            for (i = 0; i < len; i++) {
                propertiesList[i](null, true, ctx);
            }
        }
    };

    var properties = function(name, deflt, aliases) {
        var val = deflt;

        if (aliases === undefined) {
            aliases = [name];
        }

        var aliasesLen = aliases.length;
        
        var setter = function(newVal, reset, ctx) {
            if (reset !== true) {
                val = newVal;
            }

            var i, j,
                targets = PP.draw.targets,
                targetsLen = targets.length;

            for (i = 0; i < aliasesLen; i++) {
                if (ctx) {
                    ctx[aliases[i]] = val;
                } else {
                    for (j = 0; j < targetsLen; j++) {
                        targets[j].ctx[aliases[i]] = val;
                    }
                }
            }

            return newVal;
        };

        propertiesList.push(setter);

        Object.defineProperty(PP.draw, name, {
            get: function() {
                return val;
            },

            set: setter
        })
    };

    properties('color', 'black', ['fillStyle', 'strokeStyle']);
    properties('alpha', 1.0, ['globalAlpha']);
    properties('composite', 'source-over', ['globalCompositeOperation']);
    properties('lineWidth', 1);
    properties('lineCap', 'butt');
    properties('lineJoin', 'miter');
    properties('miterLimit', 10);
    properties('font', '10px sans-serif');
    properties('textAlign', 'start');
    properties('textBaseline', 'alphabetic');
});