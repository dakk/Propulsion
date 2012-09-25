propulsion.modules.push(function(PP) {
    "use strict";

    var insertSorted = function(obj) {
        var val,
            arr = PP.loop.drawList,
            target = obj.depth,
            low = 0,
            mid = 0,
            high = arr.length-1;

        while (high >= low) {
            mid = Math.floor(0.5*(high+low));
            val = arr[mid].depth;

            if (high === low) {
                if (target > val) {
                    mid = low + 1;
                }
                break;
            }
            
            if (target < val) {
                high = mid;
            } else if (val < target) {
                low = mid + 1;
            } else {
                break;
            }
        }

        arr.splice(mid, 0, obj);
        return arr;
    };

    PP.loop = {
        registrationList: [],
        drawList: [],
        heirsLists: [],
        frequency: 30,
        interval: null,

        update: function(obj) {
            var i, j, event, regObj, pos, vel, gravity, angularVel,
                events = PP.event.list,
                regList = PP.loop.registrationList,
                rlen = regList.length,
                elen = events.length;

            // Integrate positions
            for (j = 0; j < rlen; j++) {
                regObj = regList[j];
                pos = regObj.position;
                vel = regObj.velocity;
                gravity = PP.physics.gravity;

                if (pos && vel) {
                    if (gravity) {
                        pos.add(gravity.duplicate().scale(0.5)).add(vel);
                        vel.add(gravity);
                    } else {
                        pos.add(vel);
                    }
                }

                angularVel = regObj.angularVelocity;
                if (angularVel !== undefined && regObj.angle !== undefined) {
                    regObj.angle += angularVel;
                }
            }

            // Event invocation
            for (i = 0; i < elen; i++) {
                event = events[i];
                // Don't cache registration
                // list length because new objects could
                // be appended
                for (j = 0; j < regList.length; j++) {
                    regObj = regList[j];
                    if (regObj) {
                        event.invoke(regObj);
                    }
                }
            }

            // Clear views
            // Needs to be moved down when draw stuff is added
            var viewsList = PP.view.viewsList,
                vlen = viewsList.length;
            for (i = 0; i < vlen; i++) {
                viewsList[i].clear(0);
            }

            // SPECIAL EVENT
            // Invoke draw events
            // NEEDS TO HAVE SPECIAL ORDERING
            var drawEvents, delen,
                drawList = PP.loop.drawList;
            for (i = drawList.length; i >= 0; i--) {
                regObj = drawList[i];
                if (regObj) {
                    drawEvents = regObj.draw;
                    if (drawEvents) {
                        delen = drawEvents.length;
                        for (j = 0; j < delen; j++) {
                            drawEvents[j].call(regObj);
                        }
                    }
                }
            }

            // Clear display canvas
            var canvas = PP.displayCanvas.canvas;
            canvas.width = canvas.width;

            // Draw views to display canvas
            PP.view.draw();

            // Reset keys
            var key,
                keysList = PP.key.keysList,
                len = keysList.length;
            for (i = 0; i < len; i++) {
                key = keysList[i];
                key.down = false;
                key.up = false;
            }

            // Reset mouse buttons
            var button,
                buttonsList = PP.mouse.buttonsList,
                len = buttonsList.length;

            for (i = 0; i < len; i++) {
                button = buttonsList[i];
                button.up = false;
                button.down = false;
            }
        },

        beget: function(obj, position, velocity) {
            var newObj = Object.create(obj);
            if (position !== undefined) {
                newObj.position = position;
                newObj.velocity = velocity;
            }
            PP.loop.register(newObj, px, py, vx, vy);
            return newObj;
        },

        clearRegistration: function() {
            PP.loop.registrationList.length = 0;
            var heirsLists = PP.loop.heirsLists,
                len = heirsLists.length;
            for (var i = 0; i < len; i++) {
                heirsLists[i].length = 0;
            }
        },

        register: function(obj, position, velocity) {
            var rl, indicies, proto,
                len = 0;

            indicies = [];
            obj._heirsIndicies = indicies;

            // Loop up the prototype chain to add heirs stuff
            proto = obj;
            while (proto) {                
                if (proto.heirs && proto.hasOwnProperty('heirs')) {
                    var rlen = proto.heirs.length;
                    indicies[len] = rlen;
                    proto.heirs[rlen] = obj;
                } else {
                    indicies[len] = 0;
                    proto.heirs = [obj];
                    PP.loop.heirsLists.push(proto.heirs);
                }

                len++;
                proto = Object.getPrototypeOf(proto);
                if (proto === Object.prototype) {
                    break;
                }
            }

            if (!(obj.registered === true && obj.hasOwnProperty('registered'))) {
                // Add the object to the registration list
                rl = PP.loop.registrationList;
                len = rl.length;
                obj._registrationIndex = len
                rl[len] = obj;
                obj.registered = true;

                // Add the object to the draw list
                if (obj.depth === undefined) {
                    obj.depth = 0;
                }
                insertSorted(obj);
            }

            if (position !== undefined) {
                obj.position = position;
            }

            if (velocity !== undefined) {
                obj.velocity = velocity;
            }

            PP.event.initialize.invoke(obj);

            return obj;
        },

        begin: function() {
            if (PP.loop.interval !== null) {
                clearInterval(PP.loop.interval);
            }

            PP.loop.interval = setInterval(PP.loop.update, 1000/PP.loop.frequency);
        },

        remove: function(obj) {
            var i,
                indicies = obj._heirsIndicies,
                len = indicies.length,
                proto = obj;
            
            obj.registered = false;

            for (i = 0; i < len; i++) {
                proto.heirs[indicies[i]] = undefined;
                proto = Object.getPrototypeOf(proto);
            }

            PP.loop.registrationList[obj._registrationIndex] = undefined;
            return obj;
        }
    };
});