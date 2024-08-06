import { confirm } from "@inquirer/prompts";
import retry from "async-retry";
import path from "node:path";
import { bold, gray, green } from "picocolors";
import cliPkg from "../../../package.json";
import { downloadAndExtractRepo, isFolderEmpty } from "../../utils";
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
    const isEmpty = isFolderEmpty(root);

    if (!isEmpty) {
        const continueAnyway = await confirm({
            message: `Directory not empty. Continue anyway?`,
        });

        if (!continueAnyway) process.exit(0);
    }

    const selectedTemplate = await prompts.template(template);

    await retry(
        () =>
            downloadAndExtractRepo(
                root,
                "youknowedo",
                "sprigkit",
                "main",
                `templates/${selectedTemplate}`
            ),
        {
            retries: 3,
        }
    ).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
