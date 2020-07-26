"use strict";

// enforce that the children of a control statement like {#if}{/if}
// are indented by the specified amount
module.exports = ({ config, meta }) => {
    const { indent = 4 } = config;
    const textRegex = new RegExp(` {${indent}}\\S`);

    const stack = [];

    let start = false;

    const begin = (node) => {
        // + 1 for the trailing "}" on the expression
        start = node.expression.end + 1;

        node.children.forEach((child, idx) => {
            const prev = node.children[idx - 1];
            
            // Tag as first node won't have any whitespace before it, so check is simple
            if(!prev && child.type !== "Text" && child.start !== (start + indent + 1)) {
                return meta.report({
                    plugin  : "control-children-indentation",
                    message : `Expected indentation of ${indent}, got ${child.start - start - 1} instead`,
                    node,
                });
            }

            // Text as first node is a little more complicated
            if(!prev && child.type === "Text") {
                const parts = child.raw.split("\n");

                parts.forEach((part) => {
                    // Newline, ignored
                    if(!part.length) {
                        return;
                    }

                    if(!textRegex.test(part)) {
                        return meta.report({
                            plugin  : "control-children-indentation",
                            // TODO: this indentation value is totally wrong
                            message : `Expected indentation of ${indent}, got ${child.start - start - 1} instead`,
                            node,
                        });
                    }
                });
            }
        });
    };
    const end = () => stack.pop();

    return {
        "IfBlock:enter" : begin,
        "IfBlock:exit"  : end,

        // "*"(node, parent, prop) {
        //     // Ignore if:
        //     // No previous node we care about
        //     // Still in the prev node we did care about
        //     // Looking at an expression
        //     const latest = stack[stack.length - 1];

        //     if(!stack.length || latest === node || parent !== latest || prop === "expression") {
        //         return false;
        //     }

        //     console.log({ start, nodestart : node.start });

        //     const isText = node.type === "Text";

        //     // console.log({ start, node });

        //     // + 1 to account for newlines, maybe?
        //     if(!isText && node.start !== (start + indent + 1)) {
        //         return meta.report({
        //             plugin  : "control-children-indentation",
        //             message : `Expected indentation of ${indent}, got ${node.start - start - 1} instead`,
        //             node,
        //         });
        //     }

        //     if(isText) {
        //         // TODO: split apart on "\n", check that each line begins with
        //         // expected indentation somehow
        //         start = node.end;
        //     }
        // },
    };
};
