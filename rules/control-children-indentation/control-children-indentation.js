"use strict";

const leadingSpacesRegex = /^\s+/;

// enforce that the children of a control statement like {#if}{/if}
// are indented by the specified amount
module.exports = ({ config, meta }) => {
    const { indent = 4 } = config;

    // 0 needs to be a special case
    const textRegex = new RegExp(indent === 0 ? `^\\S` : `^ {${indent}}\\S`);

    const begin = (node) => {
        // node.context is for {#each} or {#await}
        // node.expression is for {#if}
        // node is for {:else}
        const { end } = node.context || node.expression || node;
        
        // + 1 for the trailing "}" on the expression
        const start = end + 1;

        node.children.forEach((child, idx) => {
            const prev = node.children[idx - 1];

            // console.log({ start, childstart : child.start });

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
                        // String.proto.match() can return null, so the || [] is important
                        const [ leadingSpaces = "" ] = part.match(leadingSpacesRegex) || [];

                        return meta.report({
                            plugin  : "control-children-indentation",
                            // TODO: this indentation value is totally wrong
                            message : `Expected indentation of ${indent}, got ${leadingSpaces.length} instead`,
                            node,
                        });
                    }
                });
            }
        });
    };

    return {
        IfBlock   : begin,
        // ElseBlock : begin,
        EachBlock : begin,
    };
};
