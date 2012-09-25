propulsion.modules.push(function(PP) {
    "use strict";
    PP.mask = {
        proto: {
            centroid: function() {
                var p1, p2, calc, i,
                    points = this.points,
                    len = points.length,
                    center = PP.vector.create(0, 0);

                for (i = 0; i < len; i++) {
                    p1 = points[i];
                    p2 = points[(i === len-1) ? 0 : i + 1];
                    calc = p1.cross(p2);
                    center.x += (p1.x + p2.x) * calc;
                    center.y += (p1.y + p2.y) * calc;
                }

                center.scale(1/(6*this.area));
                for (i = 0; i < len; i++) {
                    points[i].subtract(center);
                }

                return center;
            },

            rotate: function(angle) {
                var minx = Infinity,
                    maxx = -Infinity,
                    miny = Infinity,
                    maxy = -Infinity,
                    i, point, x, y, xx, yy,
                    s = Math.sin(angle),
                    c = Math.cos(angle),
                    points = this.points,
                    len = points.length;

                for (i = 0; i < len; i++) {
                    point = points[i];
                    x = point.x;
                    y = point.y;
                    xx = x * c - y * s;
                    yy = x * s + y * c;

                    if (xx > maxx) {
                        maxx = xx;
                    }

                    if (xx < minx) {
                        minx = xx;
                    }

                    if (yy > maxy) {
                        maxy = yy;
                    }

                    if (yy < miny) {
                        miny = yy;
                    }

                    point.x = xx;
                    point.y = yy;
                }

                this.maxx = maxx;
                this.minx = minx;
                this.maxy = maxy;
                this.miny = miny;

                return this;
            },

            translate: function(offset) {
                var i,
                    points = this.points,
                    len = points.length;

                for (i = 0; i < len; i++) {
                    points[i].add(offset);
                }

                this.minx += offset.x;
                this.maxx += offset.x;
                this.miny += offset.y;
                this.maxy += offset.y;

                return this;
            },

            duplicate: function() {
                var i,
                    points = this.points,
                    len = points.length,
                    newMask = Object.create(PP.mask.proto),
                    newPoints = [];

                newMask.points = newPoints;

                for (i = 0; i < len; i++) {
                    newPoints[i] = points[i].duplicate();
                }

                return newMask;
            },

            momentOfInertia: function(mass) {
                var p1, p2, i,
                    moi = 0,
                    points = this.points,
                    len = points.length;
                
                for (i = 0; i < len; i++) {
                    p1 = points[i];
                    p2 = points[(i + 1 == points.length) ? 0 : i + 1];
                    moi += ((p2.y - p1.y) * (p2.x + p1.x) * (p2.x * p2.x + p1.x * p1.x)) - ((p2.x - p1.x) * (p2.y + p1.y) * (p2.y * p2.y + p1.y * p1.y));
                }

                return (mass * Math.abs(moi)) / (12 * this.area());
            }, 

            mass: function(density) {
                return this.area() * density;
            },

            area: function() {
                var p1, p2, i,
                    points = this.points,
                    len = points.length,
                    area = 0;

                for (i = 0; i < len; i++) {
                    p1 = points[i];
                    p2 = points[(i + 1 === len) ? 0 : i + 1];
                    area += p1.cross(p2);
                }

                return Math.abs(0.5 * area);
            },

            project: function(n) {
                var i, point, projection,
                    min = null,
                    max = null,
                    minv = null,
                    maxv = null,
                    points = this.points,
                    len = points.length;

                for (i = 0; i < len; i++) {
                    point = points[i];
                    projection = n.dot(point);
                    if (min === null || projection < min) {
                        min = projection;
                        minv = point;
                    }

                    if (max === null || projection > max) {
                        max = projection;
                        maxv = point;
                    }
                }

                return {
                    min: min,
                    max: max,
                    minv: minv,
                    maxv: maxv
                };
            },

            normals: function() {
                var i, p1, p2, normal,
                    normals = [],
                    points = this.points,
                    len = points.length;

                for (i = 0; i < len; i++) {
                    p1 = points[i];
                    p2 = points[(i === len-1) ? 0 : i + 1];
                    normal = p1.duplicate().subtract(p2).normal().normalize();
                    normal.mask = this;
                    normals[i] = normal;
                }
                
                return normals;
            }
        },

        circleProto: {
            mass: function(density) {
                return density * this.area();
            },

            translate: function(offset) {
                this.center.add(offset);
                return this;
            },

            area: function() {
                return Math.PI * this.radius * this.radius;
            },

            project: function(n) {
                var a = n.duplicate().scale(this.radius).add(this.center),
                    b = n.duplicate().scale(-this.radius).add(this.center),
                    aproj = n.dot(a),
                    bproj = n.dot(b);

                var returned = {};

                if (bproj < aproj) {
                    returned.min = bproj;
                    returned.max = aproj;
                    returned.minv = a;
                    returned.maxv = b;
                } else {
                    returned.min = aproj;
                    returned.max = bproj;
                    returned.minv = b;
                    returned.maxv = a;
                }

                return returned;
            },
        },

        create: function(points) {
            var i, point,
                vectorPoints = [],
                newMask = Object.create(PP.mask.proto),
                len = points.length;

            for (i = 0; i < len; i++) {
                point = points[i];
                vectorPoints[i] = PP.vector.create(point[0], point[1]);
            }

            newMask.points = vectorPoints;
            return newMask;
        },

        circle: function(radius, center) {
            var newMask = Object.create(PP.mask.circleProto);
            newMask.radius = radius;

            if (center === undefined) {
                newMask.center = PP.vector.create(0, 0);
            } else {
                newMask.center = center;
            }

            return newMask;
        }
    };
});