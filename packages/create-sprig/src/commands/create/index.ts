import { confirm } from "@inquirer/prompts";
import retry from "async-retry";
import path from "node:path";
import { downloadAndExtractRepo, isFolderEmpty } from "../../utils";
import prompts from "./prompts";

export const create = async (
    directory: string | undefined,
    template?: string | undefined
) => {
    const { root, projectName } = await prompts.directory(directory);
    const relativeProjectDir = path.relative(process.cwd(), root);
    const projectDirIsCurrentDir = relativeProjectDir === "";
    const isEmpty = isFolderEmpty(root);

    if (!isEmpty) {
        const continueAnyway = await confirm({
            message: `The directory '${directory}' is not empty. Do you want to continue anyway?`,
        });

        if (!continueAnyway) process.exit(0);
    }

    console.log(`Creating a new Sprig project in ${projectName}...`);

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

    console.log("Done!");
};
