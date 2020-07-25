"use strict";

const dedent = require("dedent");

const lint = require("../../index.js");

const config = (indent) => ({
    rules : {
        "control-children-indentation" : [ "warn", {
            indent,
        }],
    },
});

const specimens = [
    [
        "indent 4 success",
        `
        {#if true}
            <div>a</div>
        {/if}
        `,
        config(4),
    ],
    [
        "indent 4 failure",
        `
        {#if true}
        <div>a</div>
        {/if}
        `,
        config(4),
    ],
    [
        "indent 0 success",
        `
        {#if true}
        <div>a</div>
        {/if}
        `,
        config(0),
    ],
    [
        "indent 0 failure",
        `
        {#if true}
            <div>a</div>
        {/if}
        `,
        config(0),
    ],
];

it.each(
    specimens.map(([ name, spec, options ]) => [ name, dedent(spec), options ])
)("control-children-indentation - %s", async (name, spec, options) => {
    const result = await lint(`${name}.svelte`, spec, options);

    // Remove node prop from returned messages, makes snapshots too chatty
    const pruned = result.map(({ node, ...rest }) => rest);

    expect(pruned).toMatchSnapshot();
});

