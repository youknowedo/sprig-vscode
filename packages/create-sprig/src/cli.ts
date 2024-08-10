#!/usr/bin/env node

import { Command, Option } from "commander";
import pico from "picocolors";
import cliPkg from "../package.json";
import { create, postbuild, postinstall } from "./commands";
import { notifyUpdate } from "./utils";

const createSprigCli = new Command();

createSprigCli
    .name(pico.bold(pico.green("create-sprig")))
    .description("Create a new Sprig project")
    .usage(`${pico.bold("[project-directory]")} [options]`)
    .arguments("[project-directory]")
    .version(cliPkg.version, "-v, --version", "Output the current version")
    .helpOption("-h, --help", "Display help for command")
    .action(create);

createSprigCli
    .command("postinstall")
    .description("Adds/updates the .sprig folder to the project.")
    .action(postinstall);

createSprigCli
    .command("postbuild")
    .description("Adds the Sprig comments to the build files.")
    .action(postbuild);

createSprigCli
    .parseAsync()
    .then(notifyUpdate)
    .catch(async (reason) => {
        await notifyUpdate();

        console.error("\nUnexpected error. Please report it as a bug:");
        console.log(reason, "\n");

        process.exit(1);
    });
