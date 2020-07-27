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

const check = (input, options = config()) => async () => {
    const result = await lint(`input.svelte`, dedent(input), options);

    // Remove node prop from returned messages, makes snapshots too chatty
    const pruned = result.map(({ node, ...rest }) => rest);

    expect(pruned).toMatchSnapshot();
};

describe.each([
    [ "{#if}", "{#if true}", "{/if}" ],
    // [ "{:else}", "{#if false}{:else}", "{/if}" ],
    [ "{#each}", "{#each foo as bar}", "{/each}" ],
])("%s", (name, prefix, suffix) => {
    it("indent 4 success", check(`
        ${prefix}
            <div>a</div>
        ${suffix}
    `));

    it("indent 4 failure", check(`
        ${prefix}
        <div>a</div>
        ${suffix}
    `));

    it("indent 0 success", check(`
        ${prefix}
        <div>a</div>
        ${suffix}
    `, config(0)));

    it("indent 0 failure", check(`
        ${prefix}
            <div>a</div>
        ${suffix}
    `, config(0)));

    it("indent 4 multiple success", check(`
        ${prefix}
            <div>a</div>
            <div>b</div>
        ${suffix}
    `));

    it("indent 4 text success", check(`
        ${prefix}
            a
        ${suffix}
    `));

    it("indent 4 text failure", check(`
        ${prefix}
        a
        ${suffix}
    `));
    
    it("indent 0 text success", check(`
        ${prefix}
        a
        ${suffix}
    `, config(0)));

    it("indent 0 text failure", check(`
        ${prefix}
            a
        ${suffix}
    `, config(0)));
});
