"use strict";

const dedent = require("dedent");

const lint = require("../../index.js");

const specimens = [
    // [
    //     "indent 4 success",
    //     `
    //     {#if true}
    //         <div>a</div>
    //     {/if}
    //     `,
    //     {
    //         rules : {
    //             "control-children-indentation" : [ "warn", {
    //                 indent : 4,
    //             }],
    //         },
    //     },
    // ],
    [
        "indent 4 failure",
        `
        {#if true}
        <div>a</div>
        {/if}
        `,
        {
            rules : {
                "control-children-indentation" : [ "warn", {
                    indent : 4,
                }],
            },
        },
    ],
];

it.each(
    specimens.map(([ name, spec, options ]) => [ name, dedent(spec), options ])
)("control-children-indentation - %s", async (name, spec, options) => {
    const result = await lint(`${name}.svelte`, spec, options);

    expect(result).toMatchSnapshot();
});

