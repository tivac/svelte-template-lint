"use strict";

const path = require("path");

const { sync : globquire } = require("require-glob");
const svelte = require("svelte/compiler");

const ruleFns = globquire([
    "**/*.js",
    "!**/*.test.js",
], {
    cwd : path.join(__dirname, "./rules"),

    // Simplify output so it matches config keys since it's a constrained set
    keygen : (options, file) => [ path.parse(file.path).name ],
});

module.exports = async (id, src, config) => {
    const results = {
        warnings : [],
        errors   : [],
    };

    const meta = {
        warn  : (info) => results.warnings.push(info),
        error : (info) => results.errors.push(info),
        config,
    };

    const ast = svelte.parse(src, { filename : id });

    const { rules } = config;
    const keys = Object.keys(rules);

    const plugins = await Promise.all(keys.map((rule) => {
        let ruleConfig = config.rules[rule];

        if(!Array.isArray(ruleConfig)) {
            ruleConfig = [ ruleConfig ];
        }
        
        return ruleFns[rule]({
            id,
            ast,
            meta,
            
            // Rule config is either the second option or false so destructuring works ok
            config : ruleConfig[1] || false,
        });
    }));

    const visitors = plugins.reduce((acc, result) => {
        Object.keys(result).forEach((prop) => {
            const [ name, side = "enter" ] = prop.split(":");
            const key = `${name}:${side}`;

            if(!acc.has(key)) {
                acc.set(key, []);
            }

            acc.get(key).push(result[prop]);
        });

        return acc;
    }, new Map());

    svelte.walk(ast, {
        enter(node, parent, prop, index) {
            const key = `${node.type}:enter`;

            if(!visitors.has(key)) {
                return;
            }
            
            visitors.get(key).forEach((visitor) => {
                visitor(node, parent, prop, index);
            });
        },

        leave(node, parent, prop, index) {
            const key = `${node.type}:exit`;

            if(!visitors.has(key)) {
                return;
            }
            
            visitors.get(key).forEach((visitor) => {
                visitor(node, parent, prop, index);
            });
        },
    });

    return results;
};

