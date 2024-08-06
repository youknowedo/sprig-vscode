import got from "got";
import { createWriteStream, readdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Stream } from "node:stream";
import { promisify } from "node:util";
import { bold, dim, yellow } from "picocolors";
import { x as extract } from "tar";
import checkForUpdate from "update-check";
import cliPkg from "../package.json";

const pipeline = promisify(Stream.pipeline);

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
    try {
        const conflicts = readdirSync(root);

        return conflicts.length === 0;
    } catch {}

    // If an error occurs, we assume the folder doesn't exist
    return true;
}

async function downloadTar(url: string, name: string) {
    const tempFile = join(tmpdir(), `${name}.temp-${Date.now()}`);
    await pipeline(got.stream(url), createWriteStream(tempFile));
    return tempFile;
}

export async function downloadAndExtractRepo(
    root: string,
    username: string,
    name: string,
    branch: string,
    filePath: string
) {
    const tempFile = await downloadTar(
        `https://codeload.github.com/${username}/${name}/tar.gz/${branch}`,
        `turbo-ct-example`
    );

    await extract({
        file: tempFile,
        cwd: root,
        strip: filePath.split("/").length + 1,
        filter: (p: string) =>
            p.startsWith(
                `${name}-${branch.replace(/\//g, "-")}${`/${filePath}/`}`
            ),
    });

    unlinkSync(tempFile);
}
