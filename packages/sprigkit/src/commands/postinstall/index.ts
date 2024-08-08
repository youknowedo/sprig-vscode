import { confirm } from "@inquirer/prompts";
import {
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import pico from "picocolors";
import cliPkg from "../../../package.json";
import {
    checkFolder,
    downloadAndExtractRepo,
    getPackageManager,
} from "../../utils";

export const postinstall = async (directory: string | undefined) => {
    const root = path.resolve("./.sprig");
    const { empty, exists } = checkFolder(root);

    if (!exists) mkdirSync(root, { recursive: true });

    if (!empty) {
        try {
            for (const file of readdirSync(root)) {
                rmSync(path.join(root, file), {
                    recursive: true,
                    force: true,
                });
            }
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    await downloadAndExtractRepo(
        root,
        "youknowedo",
        "sprigkit",
        "main",
        "packages/sprigkit/.sprig"
    ).catch((error) => {
        console.error(error);
        process.exit(1);
    });
};
