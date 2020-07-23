"use strict";

module.exports = {
    extends : [
        "@tivac",
        "plugin:jest/recommended",
    ],

    parser : "babel-eslint",

    env : {
        node : true,
        jest : true,
    },

    plugins : [
        "jest",
    ],

    rules : {
        "jest/no-test-callback" : "warn",
        "jest/no-try-expect"    : "warn",
    },
};
