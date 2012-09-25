propulsion.modules.push(function(PP) {
    "use strict";
    PP.key = {
        cancel: 3,
        help: 6,
        backspace: 8,
        tab: 9,
        clear: 12,
        enter: 13,
        numEnter: 14,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pause: 19,
        capsLock: 20,
        escape: 27,
        space: 32,
        pageUp: 33,
        pageDown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        printScreen: 44,
        insert: 45,
        del: 46,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        colon: 58,
        semicolon: 59,
        lessThan: 60,
        equals: 61,
        greaterThan: 62,
        questionMark: 63,
        at: 64,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
        leftWindow: 91,
        rightWindow: 92,
        select: 93,
        num0: 96,
        num1: 97,
        num2: 98,
        num3: 99,
        num4: 100,
        num5: 101,
        num6: 102,
        num7: 103,
        num8: 104,
        num9: 105,
        numAsterisk: 106,
        numPlus: 107,
        numDash: 109,
        numHyphen: 109,
        numPeriod: 110,
        numSlash: 111,
        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123,
        numLock: 144,
        scrollLock: 145,
        circumflex: 160,
        exclamation: 161,
        doubleQuote: 162,
        hash: 163,
        dollarSign: 164,
        percent: 165,
        ampersand: 166,
        underscore: 167,
        openParenthesis: 168,
        closeParenthesis: 169,
        asterisk: 170,
        plus: 171,
        pipe: 172,
        hyphen: 173,
        openCurlyBracket: 174,
        closeCurlyBracket: 175,
        tilde: 176,
        myComputer: 182,
        myCalculator: 183,
        comma: 188,
        period: 190,
        slash: 191,
        backTick: 192,
        openSquareBracket: 219,
        backSlash: 220,
        closeSquareBracket: 221,
        quote: 222,
        command: 224,
        altGr: 225
    };

    var keyName, code, keyObj,
        keysCodeList = [],
        keysList = [],
        keys = PP.key;
    for (keyName in keys) {
        if (keys.hasOwnProperty(keyName)) {
            code = keys[keyName];
            keyObj = {
                code: code,
                up: false,
                down: false,
                pressed: false
            };
            keys[keyName] = keyObj;
            keysCodeList[code] = keyObj;
            keysList.push(keyObj);
        }
    }

    PP.key.keysList = keysList;

    var keydown, keyup;

    keydown = function(e) {
        var key = keysCodeList[e.keyCode];
        if (key) {
            key.down = true;
            key.pressed = true;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        }
    };

    keyup = function(e) {
        var key = keysCodeList[e.keyCode];
        if (key) {
            key.up = true;
            key.pressed = false;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        }
    };

    // Might need to change binding to display canvas
    if (document.addEventListener) {
        document.addEventListener("keydown", keydown, false);
        document.addEventListener("keyup", keyup, false);
    } else if (document.attachEvent) {
        document.attachEvent("onkeydown", keydown);
        document.attachEvent("onkeyup", keyup);
    } else {
        document.onkeydown = keydown;
        document.onkeyup = keyup;
    }
});