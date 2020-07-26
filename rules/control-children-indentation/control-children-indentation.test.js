"use strict";

const dedent = require("dedent");

const lint = require("../../index.js");

const config = (indent = 4) => ({
    rules : {
        "control-children-indentation" : [ "warn", {
            indent,
        }],
    },
});

const specimens = [
    // [
    //     "indent 4 success",
    //     `
    //     {#if true}
    //         <div>a</div>
    //     {/if}
    //     `
    // ],
    // [
    //     "indent 4 failure",
    //     `
    //     {#if true}
    //     <div>a</div>
    //     {/if}
    //     `
    // ],
    // [
    //     "indent 0 success",
    //     `
    //     {#if true}
    //     <div>a</div>
    //     {/if}
    //     `,
    //     config(0),
    // ],
    // [
    //     "indent 0 failure",
    //     `
    //     {#if true}
    //         <div>a</div>
    //     {/if}
    //     `,
    //     config(0),
    // ],
    // [
    //     "Indent 4 multiple success",
    //     `
    //     {#if true}
    //         <div>a</div>
    //         <div>b</div>
    //     {/if}
    //     `
    // ],
    // [
    //     "Indent 4 text success",
    //     `
    //     {#if true}
    //         a
    //     {/if}
    //     `
    // ],
    [
        "Indent 4 text failure",
        `
        {#if true}
          a
        {/if}
        `,
    ],
];

it.each(
    specimens.map(([ name, spec, options = config() ]) => [ name, dedent(spec), options ])
)("control-children-indentation - %s", async (name, spec, options) => {
    const result = await lint(`${name}.svelte`, spec, options);

    // Remove node prop from returned messages, makes snapshots too chatty
    const pruned = result.map(({ node, ...rest }) => rest);

    expect(pruned).toMatchSnapshot();
});

