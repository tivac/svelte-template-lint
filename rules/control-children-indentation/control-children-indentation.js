"use strict";

// TODO: enforce that the childrenl of a control statement like {#if}{/if}
// are indented by the specified amount
module.exports = ({ id, ast, config, meta }) => {
    const { indent = 4 } = config;

    return {
        IfBlock(...args) {
            console.log("IfBlock", ...args);
        },
    };
};
