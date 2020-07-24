"use strict";

// TODO: enforce that the childrenl of a control statement like {#if}{/if}
// are indented by the specified amount
module.exports = ({ id, ast, config, meta }) => {
    const { indent = 4 } = config;

    let start = false;

    return {
        "IfBlock:enter"(node) {
            console.log("IfBlock", node);

            // Extra + 1 is for the trailing "}"
            start = node.expression.end + 1;
        },

        "IfBlock:exit"() {
            start = false;
        },

        "*"(node, parent, prop) {
            console.log(prop);

            // Ignore if:
            // Not in an if block
            // Already an if block
            // Looking at if expression itself
            if(!start || node.type === "IfBlock" || prop === "expression") {
                return;
            }

            if(node.start < (start + indent)) {
                meta.report({
                    plugn : "control-children-indentation",
                    node,
                });
            }
        },
    };
};
