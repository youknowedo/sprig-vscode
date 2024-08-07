import { Command, Option } from "commander";
import pico from "picocolors";
import cliPkg from "../package.json";
import { create } from "./commands";
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
    .parseAsync()
    .then(notifyUpdate)
    .catch(async (reason) => {
        await notifyUpdate();

        console.error("\nUnexpected error. Please report it as a bug:");
        console.log(reason, "\n");

        process.exit(1);
    });
