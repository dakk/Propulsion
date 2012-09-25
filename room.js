propulsion.modules.push(function(PP) {
    "use strict";
    var currentRoom = null;
    PP.room = {
        get currentRoom() {
            return currentRoom;
        },

        set currentRoom(callback) {
            currentRoom = callback;
            PP.view.viewsList.length = 0;
            // Make the default view
            PP.view.register(PP.view.create(PP.vector.create(0, 0), PP.displayCanvas.width, PP.displayCanvas.height));
            PP.loop.clearRegistration();
            callback();
        }
    };
});