import { confirm } from "@inquirer/prompts";
import retry from "async-retry";
import { createWriteStream, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { bold, gray, green } from "picocolors";
import cliPkg from "../../../package.json";
import { checkFolder, downloadAndExtractRepo } from "../../utils";
import prompts from "./prompts";

export const create = async (
    directory: string | undefined,
    template?: string | undefined
) => {
    console.log(
        "\n",
        bold(green("create-sprig")),
        gray("v" + cliPkg.version),
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
};
