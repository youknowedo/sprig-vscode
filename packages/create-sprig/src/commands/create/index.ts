import { confirm } from "@inquirer/prompts";
import retry from "async-retry";
import { createWriteStream, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import pico from "picocolors";
import cliPkg from "../../../package.json";
import {
    checkFolder,
    downloadAndExtractRepo,
    getPackageManager,
} from "../../utils";
import prompts from "./prompts";

export const create = async (
    directory: string | undefined,
    template?: string | undefined
) => {
    console.log(
        "\n",
        pico.bold(pico.green("create-sprig")),
        pico.dim("v" + cliPkg.version),
        "\n"
    );

    const { root, projectName } = await prompts.directory(directory);
    const relativeProjectDir = path.relative(process.cwd(), root);
    const projectDirIsCurrentDir = relativeProjectDir === "";
    const { empty, exists } = checkFolder(root);

    if (!exists) mkdirSync(root, { recursive: true });

    if (!empty) {
        const continueAnyway = await confirm({
            message: `Directory not empty. Continue anyway?`,
        });

        if (!continueAnyway) process.exit(0);
    }

    const selectedTemplate = await prompts.template(template);

    await downloadAndExtractRepo(
        root,
        "youknowedo",
        "sprigkit",
        "main",
        `templates/${selectedTemplate}`
    ).catch((error) => {
        console.error(error);
        process.exit(1);
    });

    console.log(`
${pico.bold(pico.green("Success!"))}

Next steps:
  1. ${pico.bold(pico.dim("cd" + (projectDirIsCurrentDir ? "" : " " + projectName)))}
  2. ${pico.bold(pico.dim(`${getPackageManager()} install`))}
  3. ${pico.bold(pico.dim('git init && git add -A && git commit -m "Initial commit" (optional)'))}

${pico.bold(pico.red("Hack Club"))}. By high schoolers, for high schoolers.`);
};
