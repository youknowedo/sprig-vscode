#!/usr/bin/env node

import { Command, Option } from "commander";
import pico from "picocolors";
import cliPkg from "../package.json";
import { postinstall } from "./commands";
import { notifyUpdate } from "./utils";

const sprigkitCli = new Command();

sprigkitCli
    .name(pico.bold(pico.green("sprigkit")))
    .version(cliPkg.version, "-v, --version", "Output the current version")
    .helpOption("-h, --help", "Display help for command");

sprigkitCli
    .command("postinstall")
    .description("Adds/updates the .sprig folder to the project.")
    .action(postinstall);

sprigkitCli
    .parseAsync()
    .then(notifyUpdate)
    .catch(async (reason) => {
        await notifyUpdate();

        console.error("\nUnexpected error. Please report it as a bug:");
        console.log(reason, "\n");

        process.exit(1);
    });
