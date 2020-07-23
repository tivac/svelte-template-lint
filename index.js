"use strict";

const { sync : globquire } = require("require-glob");
const svelte = require("svelte/compiler");

const rules = globquire([
    "./rules/*/*.js",
]);

const keys = Object.keys(rules);

module.exports = (id, src) => {
    const results = {
        warnings : [],
        errors   : [],
    };

    const meta = {
        warn  : (info) => results.warnings.push(info),
        error : (info) => results.errors.push(info),
    };

    const ast = svelte.parse(src, { filename : id });

    keys.forEach((rule) => {
        rules[rule][rule](id, ast, meta);
    });

    return results;
};

