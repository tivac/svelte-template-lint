"use strict";

const fs = require("fs/promises");

const meow = require("meow");
const { cosmicconfigSync : loadConfig } = ;
const { sync : globby } = require("globby");

const lint = require("../index.js");

const findConfig = require("cosmiconfig").cosmiconfigSync("svelte-template-lint", {
    packageProp : "configs.svelteTemplateLint",
});

const config = findConfig.search();

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

    return [ id, await lint(id, src, config) ];
}))
.then((results) => {
    console.log(results);
});
