import fs from "fs-extra";
import { bold, dim, yellow } from "picocolors";
import checkForUpdate from "update-check";
import cliPkg from "../package.json";

const update = checkForUpdate(cliPkg).catch(() => null);

export async function notifyUpdate(): Promise<void> {
    try {
        const res = await update;
        if (res?.latest) {
            console.log();
            console.log(
                yellow(bold("A new version of `create-sprig` is available!"))
            );
            console.log();
        }
        process.exit();
    } catch (_) {
        // ignore error
    }
}

export function isFolderEmpty(root: string) {
    const conflicts = fs.readdirSync(root);

    return conflicts.length === 0;
}
