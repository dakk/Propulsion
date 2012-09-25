propulsion.modules.push(function(PP) {
    "use strict";
    var responseProto = {
        response: function() {
            var j, v_0_P, e,
                square = PP.math.square,
                c = this.contactPoint,
                n = this.normal,
                a = this.o1,
                b = this.o2,
                r_A = c.duplicate().subtract(a.position).normal(),
                r_B = c.duplicate().subtract(b.position).normal();
            
            // v_0_P = v_0_AP - v_1_BP
            v_0_P = a.velocity.duplicate().add(r_A.duplicate().magnitude(a.angularVelocity)).subtract(b.velocity.duplicate().add(r_B.duplicate().magnitude(b.angularVelocity))),
            e = 0.5 * (a.restitution + b.restitution);
            
            if (v_0_P.dot(n) >= 0) {
                return false;
            }

            j = n.duplicate().scale((-(e+1) * v_0_P.dot(n))/((1/a.mass)+(1/b.mass)+(square(r_A.dot(n))/a.momentOfInertia)+(square(r_B.dot(n))/b.momentOfInertia)));
            a.velocity.add(j.duplicate().scale(1/a.mass));
            b.velocity.add(j.duplicate().scale(-1/b.mass));
            a.angularVelocity += r_A.dot(j)/a.momentOfInertia;
            b.angularVelocity -= r_B.dot(j)/b.momentOfInertia;
            return true;
        }
    };

    var resolveProto = {
        resolve: function(ratio) {
            if (ratio === undefined) {
                var ratio = 1;
            }
            
            var o1 = this.o1,
                o2 = this.o2,
                responseObj = Object.create(responseProto),
                contactPoint = this.contactPoint.duplicate(),
                o1Offset = this.mtv.duplicate().scale(ratio-1),
                o2Offset = this.mtv.duplicate().scale(ratio);
            
            o1.position.add(o1Offset);
            o2.position.add(o2Offset);

            if (this.contactObj === o1) {
                responseObj.o1 = this.o1;
                responseObj.o2 = this.o2;
                contactPoint.add(o1Offset);
            } else {
                responseObj.o1 = this.o2;
                responseObj.o2 = this.o1;
                contactPoint.add(o2Offset);
            }

            responseObj.contactPoint = contactPoint;
            responseObj.normal = this.normal;

            return responseObj;
        }
    };

    PP.collision = {
        objects: function(o1, o2) {
            var contactObj, contactPoint, mtv,
                m1 = o1.mask.duplicate().rotate(o1.angle).translate(o1.position),
                m2 = o2.mask.duplicate().rotate(o2.angle).translate(o2.position);
            
            // Broad phase bounding box collision detection
            if (((m1.minx < m2.minx && m1.maxx < m2.minx) || (m1.minx > m2.maxx && m1.maxx > m2.maxx)) && ((m1.miny < m2.miny && m1.maxy < m2.miny) || (m1.miny > m2.maxy && m1.maxy > m2.maxy))) {
                return false;
            }

            var normals = m1.normals().concat(m2.normals()),
                len = normals.length,
                minM = null,
                minNormal = null;

            m1.obj = o1;
            m2.obj = o2;
            for (var i = 0; i < len; i++) {
                var otherMask,
                    n = normals[i],
                    thisMask = n.mask;

                if (thisMask === m1) {
                    otherMask = m2;
                } else {
                    otherMask = m1;
                }

                var thisProj = thisMask.project(n),
                    otherProj = otherMask.project(n);

                var sub1 = otherProj.max - thisProj.min,
                    sub2 = thisProj.max - otherProj.min;
                
                if (sub1 < 0 || sub2 < 0) {
                    return false;
                }

                // m is the minimum amount of overlap between projections
                var m = Math.min(Math.abs(sub1), Math.abs(sub2));

                if (minM === null || m < minM) {
                    minM = m;
                    minNormal = n;
                    if ((otherProj.max + otherProj.min - thisProj.max - thisProj.min) < 0) {
                        n.scale(-1);
                    }

                    // mtv is the minimum translation vector
                    mtv = n.duplicate().scale(m);

                    var midpoint = 0.5 * (thisProj.min + thisProj.max),
                        distMin = Math.abs(otherProj.min - midpoint),
                        distMax = Math.abs(otherProj.max - midpoint);

                    if (distMin < distMax) {
                        contactPoint = otherProj.minv;
                    } else {
                        contactPoint = otherProj.maxv;
                    }

                    if (otherMask.obj === o1) {
                        contactObj = o1;
                    } else {
                        contactObj = o2;
                    }
                }
            }

            // The MTV should always be applied to o2 (by default...)
            if (contactObj === o1) {
                mtv.scale(-1);
            }

            var resolveObj = Object.create(resolveProto);
            resolveObj.mtv = mtv;
            resolveObj.contactPoint = contactPoint;
            resolveObj.contactObj = contactObj;
            resolveObj.o1 = o1;
            resolveObj.o2 = o2;
            resolveObj.normal = minNormal;
            return resolveObj;
        }
    };
});