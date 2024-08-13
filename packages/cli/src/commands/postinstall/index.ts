import { resolve } from "dns";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { checkFolder, downloadAndExtractRepo } from "../../utils";

export const postinstall = async (directory: string | undefined) => {
    // Check if has internet connection
    resolve("github.com", (err) => {
        if (err) {
            console.error(
                "No internet connection. Please check your connection and try again."
            );
            process.exit(1);
        }
    });

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
        "packages/cli/.sprig"
    ).catch((error) => {
        console.error(error);
        process.exit(1);
    });
};
