propulsion.modules.push(function(PP) {
    "use strict";
    var proto = {
        duplicate: function() {
            return PP.vector.create(this.x, this.y);
        },

        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },

        subtract: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },

        scale: function(scaleX, scaleY) {
            this.x *= scaleX;
            if (scaleY === undefined) {
                this.y *= scaleX;
            } else {
                this.y *= scaleY;
            }
            
            return this;
        },

        dot: function(v) {
            return this.x * v.x + this.y * v.y;
        },

        cross: function(v) {
            return (this.x * v.y) - (this.y * v.x);
        },

        normalize: function() {
            return this.magnitude(1);
        },

        normal: function() {
            var buffer = this.x;
            this.x = -this.y;
            this.y = buffer;
            return this;
        },

        magnitude: function(val) {
            var scalar,
                x = this.x,
                y = this.y,
                mag = Math.sqrt(x * x + y * y);

            if (val === undefined) {
                return mag;
            }

            scalar = val/mag;
            this.x *= scalar;
            this.y *= scalar;
            return this;
        },

        direction: function(angle) {
            if (val === undefined) {
                return Math.atan2(this.y, this.x);
            }

            var mag = this.magnitude();
            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;
            return this;
        },

        beget: function() {
            return Object.create(this);
        },

        copyTo: function(destination) {
            destination.x = this.x;
            destination.y = this.y;
            return this;
        },

        copyFrom: function(source) {
            this.x = source.x;
            this.y = source.y;
            return this;
        }
    };

    PP.vector = {
        create: function(x, y) {
            var newVector = Object.create(proto);
            newVector.x = x;
            newVector.y = y;
            return newVector;
        }
    };
});