propulsion.modules.push(function(PP) {
    "use strict";

    var makeEvent = (function() {
        var proto = {
            invoke: function(thisObj, eventObj) {
                var callbacks, i, len;
                if (eventObj) {
                    callbacks = eventObj[this.name];
                } else {
                    callbacks = thisObj[this.name];
                }

                if (callbacks) {
                    len = callbacks.length;
                    for (i = 0; i < len; i++) {
                        if (this.execute) {
                            this.execute(thisObj, callbacks[i]);
                        } else {
                            callbacks[i].call(thisObj, this);
                        }
                    }
                }
            },

            bind: function(obj, callback) {
                var name = this.name,
                    initialize = this.initialize,
                    arr = obj[name];

                if (initialize) {
                    initialize.apply(this, arguments);
                }

                if (arr) {
                    arr.push(callback);
                } else {
                    obj[name] = [callback];
                }

                return callback;
            }
        };

        return function(name, initialize, execute) {
            var obj = Object.create(proto);
            obj.name = name;
            obj.initialize = initialize;
            obj.execute = execute;
            return obj;
        };
    }());
    
    PP.event = {
        // This list is only for events that need to be kept
        // in the same specific order and are executed every tick
        list: [
            makeEvent(
                'beginTick',
                null,
                null
            ),

            makeEvent(
                'keyDown',
                function(obj, callback, key) {
                    callback.key = key;
                },

                function(obj, callback) {
                    var key = callback.key;
                    if (key.down) {
                        callback.call(obj, this, key);
                    }
                }
            ),

            makeEvent(
                'keyPressed',
                function(obj, callback, key) {
                    callback.key = key;
                },

                function(obj, callback) {
                    var key = callback.key;
                    if (key.pressed) {
                        callback.call(obj, this, key);
                    }
                }
            ),

            makeEvent(
                'keyUp',
                function(obj, callback, key) {
                    callback.key = key;
                },
                
                function(obj, callback) {
                    var key = callback.key;
                    if (key.up) {
                        callback.call(obj, this, key);
                    }
                }
            ),

            makeEvent(
                'mouseDown',
                function(obj, callback, button) {
                    callback.button = button;
                },

                function(obj, callback) {
                    var button = callback.button;
                    if (button.down) {
                        callback.call(obj, this, button);
                    }
                }
            ),

            makeEvent(
                'mousePressed',
                function(obj, callback, button) {
                    callback.button = button;
                },

                function(obj, callback) {
                    var button = callback.button;
                    if (button.pressed) {
                        callback.call(obj, this, button);
                    }
                }
            ),

            makeEvent(
                'mouseUp',
                function(obj, callback, button) {
                    callback.button = button;
                },

                function(obj, callback) {
                    var button = callback.button;
                    if (button.up) {
                        callback.call(obj, this, button);
                    }
                }
            ),

            makeEvent(
                'tick',
                null,
                null
            )
        ],

        draw: makeEvent(
            'draw',
            null,
            null
        ),

        initialize: makeEvent(
            'initialize',
            null,
            null
        )
    };

    // Add every event type to the PP.event object so
    // it can be accessed easily
    var i, thisEvent,
        eventsList = PP.event.list,
        len = eventsList.length;

    for (i = 0; i < len; i++) {
        thisEvent = eventsList[i];
        PP.event[thisEvent.name] = thisEvent;
    }
});