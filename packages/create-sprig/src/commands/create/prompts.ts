import { input, select } from "@inquirer/prompts";
import {
    getAvailablePackageManagers,
    PackageManagers,
    validateDirectory,
    type PackageManager,
} from "../../utils";

async function directory(dir: string | undefined) {
    const projectDir =
        dir ??
        (await input({
            message: "Where would you like to create your Turborepo?",
            default: "./my-turborepo",
            validate: (d: string) => {
                const { valid, error } = validateDirectory(d);
                if (!valid && error) {
                    return error;
                }
                return true;
            },
            transformer: (value, { isFinal }) => {
                if (isFinal) {
                    return value.trim();
                }
                return value;
            },
        }));

    return validateDirectory(projectDir);
}

async function packageManager(
    manager?: PackageManager,
    skipTransforms?: boolean
) {
    // if skip transforms is passed, we don't need to ask about the package manager (because that requires a transform)
    if (skipTransforms) {
        return undefined;
    }

    const availablePackageManagers = await getAvailablePackageManagers();

    const packageManager =
        (availablePackageManagers[manager as PackageManager] && manager) ||
        (await select({
            message: "Which package manager do you want to use?",
            choices: PackageManagers.map((pm) => ({
                title: pm,
                value: pm,
                disabled: availablePackageManagers[pm]
                    ? false
                    : `not installed`,
            })),
        }));

    return {
        name: packageManager,
        version: availablePackageManagers[packageManager],
    };
}

export default {
    directory,
    packageManager,
};
