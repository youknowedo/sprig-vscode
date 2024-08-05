import { Command, Option } from "commander";
import { bold, green } from "picocolors";
import cliPkg from "../package.json";
import { create } from "./commands";
import { notifyUpdate } from "./utils";

const createSprigCli = new Command();

createSprigCli
    .name(bold(green("create-sprig")))
    .description("Create a new Sprig project")
    .usage(`${bold("<project-directory>")} [options]`)
    .arguments("project-directory")
    .addOption(
        new Option(
            "-m, --package-manager <package-manager>",
            "Specify the package manager to use"
        ).choices(["npm", "yarn", "pnpm", "bun"])
    )
    .option(
        "--skip-install",
        "Do not run a package manager install after creating the project",
        false
    )
    .option(
        "--skip-transforms",
        "Do not run any transforms on the project",
        false
    )
    .addOption(
        new Option(
            "-t, --template <template>",
            "Specify a template to use for creating the project"
        ).choices(["default", "vanilla"])
    )
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
