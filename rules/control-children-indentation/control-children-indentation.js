"use strict";

// enforce that the children of a control statement like {#if}{/if}
// are indented by the specified amount
module.exports = ({ config, meta }) => {
    const { indent = 4 } = config;

    const stack = [];

    let start = false;

    const begin = (node) => {
        stack.push(node);
        
        // + 1 for the trailing "}" on the expression
        start = node.expression.end + 1;
    };
    const end = () => stack.pop();

    return {
        "IfBlock:enter" : begin,
        "IfBlock:exit"  : end,

        "*"(node, parent, prop) {
            // Ignore if:
            // No previous node we care about
            // Still in the prev node we did care about
            // Looking at an expression
            if(!stack.length || stack[stack.length - 1] === node || prop === "expression") {
                return false;
            }

            const isText = node.type === "Text";

            // console.log({ start, node });

            // + 1 to account for newlines, maybe?
            if(!isText && node.start !== (start + indent + 1)) {
                return meta.report({
                    plugin  : "control-children-indentation",
                    message : `Expected indentation of ${indent}, got ${node.start - start - 1} instead`,
                    node,
                });
            }

            if(isText) {
                // TODO: split apart on "\n", check that each line begins with
                // expected indentation somehow
                start = node.end;
            }
        },
    };
};
