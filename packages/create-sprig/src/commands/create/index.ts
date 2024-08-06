import { confirm } from "@inquirer/prompts";
import path from "node:path";
import { isFolderEmpty } from "../../utils";
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

    const selectedTemplate = await prompts.template(template);
};
