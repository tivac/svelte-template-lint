"use strict";

module.exports = {
    extends : [
        "@tivac",
        "plugin:jest/recommended",
    ],

    parser : "babel-eslint",

    env : {
        es6  : true,
        jest : true,
        node : true,
    },

    plugins : [
        "jest",
    ],

    rules : {
        "jest/no-test-callback" : "warn",
        "jest/no-try-expect"    : "warn",
        "jest/expect-expect"    : [ "warn", {
            assertFunctionNames : [ "expect", "check" ],
        }],

        "consistent-return"     : "off",
    },
};
