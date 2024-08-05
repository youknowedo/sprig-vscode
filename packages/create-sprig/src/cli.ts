#!/usr/bin/env node

import { create } from "create-create-app";
import { resolve } from "path";

const templateRoot = resolve(__dirname, "..", "templates");

const caveat = `
This is a caveat!
You can change this in \`src/cli.ts\`.
`;

// See https://github.com/uetchy/create-create-app/blob/master/README.md for other options.

create("create-sprig", {
    promptForPackageManager: true,
    promptForTemplate: true,
    templateRoot,
    after: ({ answers }) =>
        console.log(`Ok you chose ${answers.architecture}.`),
    caveat,
});
