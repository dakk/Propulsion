propulsion.modules.push(function(PP) {
    PP.draw = {
        // TODO: FILL STYLES, ECT
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
                ctx = this.ctx;
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
                ctx = this.ctx;

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
        }
    };

    var color = "black";
    Object.defineProperty(PP.draw, "color", {
        get: function() {
            return color;
        },

        set: function(val) {
            color = val;
            return val;
        }
    });

    (function() {
        var value = "black";

    }());
});