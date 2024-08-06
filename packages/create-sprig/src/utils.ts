import got from "got";
import { createWriteStream, readdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promises, Readable, Stream } from "node:stream";
import { promisify } from "node:util";
import pico from "picocolors";
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
                pico.yellow(
                    pico.bold("A new version of `create-sprig` is available!")
                )
            );
            console.log();
        }
        process.exit();
    } catch (_) {
        // ignore error
    }
}

export const checkFolder = (
    root: string
): { exists: boolean; empty: boolean } => {
    try {
        const conflicts = readdirSync(root);

        return {
            exists: true,
            empty: conflicts.length === 0,
        };
    } catch {
        return {
            exists: false,
            empty: true,
        };
    }
};

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

export function getPackageManager() {
    if (!process.env.npm_config_user_agent) {
        return undefined;
    }
    const user_agent = process.env.npm_config_user_agent;
    const pm_spec = user_agent.split(" ")[0];
    const separator_pos = pm_spec.lastIndexOf("/");
    const name = pm_spec.substring(0, separator_pos);
    return name === "npminstall" ? "cnpm" : name;
}
