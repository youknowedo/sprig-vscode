import path from "node:path";
import { getAvailablePackageManagers, type PackageManager } from "../../utils";
import prompts from "./prompts";

export const create = async (
    directory: string | undefined,
    options: {
        packageManager?: PackageManager;
        skipInstall?: boolean;
        skipTransforms?: boolean;
        template?: "default" | "vanilla" | undefined;
    }
) => {
    const { packageManager, skipInstall, skipTransforms, template } = options;

    const availablePackageManagers = getAvailablePackageManagers();

    const { root, projectName } = await prompts.directory(directory);
    const relativeProjectDir = path.relative(process.cwd(), root);
    const projectDirIsCurrentDir = relativeProjectDir === "";

    // selected package manager can be undefined if the user chooses to skip transforms
    const selectedPackageManagerDetails = await prompts.packageManager(
        packageManager,
        skipTransforms
    );

    if (packageManager && skipTransforms) {
        console.warn(
            "--skip-transforms conflicts with <package-manager>. The package manager argument will be ignored."
        );
    }

    const templateName =
        template && template !== "default" ? template : "vanilla";
};
