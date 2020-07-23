"use strict";

const fs = require("fs/promises");

const meow = require("meow");
const { sync : globby } = require("globby");

const lint = require("../index.js");

const cli = meow(`
    Usage
        $ svelte-template-lint <glob>

    Options
      --max-warnings, -w    Maximum warnings to allow before failing
`, {
    flags : {
        maxWarnings : {
            type  : "number",
            alias : "w",
        },
    },
});

const files = globby(cli.input);

Promise.all(files.map(async (id) => {
    const src = await fs.readFile(id, "utf8");

    return [ id, await lint(id, src) ];
}))
.then((results) => {
    console.log(results);
});
