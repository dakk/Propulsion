propulsion.modules.push(function(PP) {
    PP.math = {
        sign: function(num) {
            if (num === 0) {
                return 0;
            }

            if (num < 0) {
                return -1;
            }

            if (num > 0) {
                return 1;
            }
        },

        square: function(num) {
            return num*num;
        }
    };
});