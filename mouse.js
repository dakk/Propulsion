propulsion.modules.push(function(PP) {
    "use strict";
    var loffset = function(elem) {
        var o = elem.offsetLeft;

        if (elem.offsetParent !== null) {
            o += loffset(elem.offsetParent);
        }
        
        return o;
    };

    var toffset = function(elem) {
        var o = elem.offsetTop;

        if (elem.offsetParent !== null) {
            o += toffset(elem.offsetParent);
        }
        
        return o;
    };

    PP.mouse = {
        offsetLeft: loffset(PP.displayCanvas.canvas),
        offsetTop: toffset(PP.displayCanvas.canvas),
        screenPosition: PP.vector.create(0, 0),
        position: PP.vector.create(0, 0),
        left: {
            down: false,
            pressed: false,
            up: false,
        },

        middle: {
            down: false,
            pressed: false,
            up: false
        },

        right: {
            down: false,
            pressed: false,
            up: false
        }
    };

    PP.mouse.buttonsList = [PP.mouse.left, PP.mouse.middle, PP.mouse.right];

    document.addEventListener('mousemove', function(e) {
        var posx = 0,
            posy = 0;

        if (!e) {
            e = window.event;
        }
        
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        
        var i, view, rel,
            pos = PP.vector.create(posx - PP.mouse.offsetLeft, posy - PP.mouse.offsetTop).copyTo(PP.mouse.screenPosition),
            views = PP.view.viewsList,
            len = views.length;
        for (i = 0; i < len; i++) {
            view = views[i];
            rel = pos.duplicate().subtract(view.portPosition);
            view.mousePosition.copyFrom(rel).scale(view.width/view.portWidth, view.height/view.portHeight).add(view.position);
            // Check to see if the mouse is over a view
            if (rel.x > 0 && rel.y > 0 && rel.x <= view.portWidth && rel.y <= view.portHeight) {
                view.mousePosition.copyTo(PP.mouse.position);
            }
        }
    });

    document.addEventListener('mousedown', function(e) {
        var button = PP.mouse.buttonsList[e.button];
        if (button) {
            button.down = true;
            button.pressed = true;
        }
    });

    document.addEventListener('mouseup', function(e) {
        var button = PP.mouse.buttonsList[e.button];
        if (button) {
            button.up = true;
            button.pressed = false;
        }
    });
});