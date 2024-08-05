import { dns } from "bun";
import type { Options } from "execa";
import { execa } from "execa";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { bold, dim, yellow } from "picocolors";
import checkForUpdate from "update-check";
import cliPkg from "../package.json";

export const PackageManagers = ["npm", "yarn", "pnpm", "bun"] as const;
export type PackageManager = (typeof PackageManagers)[number];

export async function exec(
    command: string,
    args: Array<string> = [],
    opts?: Options
) {
    const execOptions: Options = {
        cwd: os.tmpdir(),
        env: { COREPACK_ENABLE_STRICT: "0" },
        ...opts,
    };
    try {
        const { stdout } = await execa(command, args, execOptions);
        return stdout?.toString().trim();
    } catch {
        return undefined;
    }
}

export async function getAvailablePackageManagers(): Promise<
    Record<PackageManager, string | undefined>
> {
    const [yarn, npm, pnpm, bun] = await Promise.all([
        exec("yarnpkg", ["--version"]),
        exec("npm", ["--version"]),
        exec("pnpm", ["--version"]),
        exec("bun", ["--version"]),
    ]);

    return {
        yarn,
        pnpm,
        npm,
        bun,
    };
}

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

export function validateDirectory(directory: string): {
    valid: boolean;
    root: string;
    projectName: string;
    error?: string;
} {
    const root = path.resolve(directory);
    const projectName = path.basename(root);
    const exists = fs.existsSync(root);

    const stat = fs.lstatSync(root, { throwIfNoEntry: false });
    if (stat && !stat.isDirectory()) {
        return {
            valid: false,
            root,
            projectName,
            error: `${dim(
                projectName
            )} is not a directory - please try a different location`,
        };
    }

    if (exists) {
        const { isEmpty, conflicts } = isFolderEmpty(root);
        if (!isEmpty) {
            return {
                valid: false,
                root,
                projectName,
                error: `${dim(projectName)} (${root}) has ${
                    conflicts.length
                } conflicting ${
                    conflicts.length === 1 ? "file" : "files"
                } - please try a different location`,
            };
        }
    }

    return { valid: true, root, projectName };
}

const VALID_FILES = [
    ".DS_Store",
    ".git",
    ".gitattributes",
    ".gitignore",
    ".gitlab-ci.yml",
    ".hg",
    ".hgcheck",
    ".hgignore",
    ".idea",
    ".npmignore",
    ".travis.yml",
    "LICENSE",
    "Thumbs.db",
    "docs",
    "mkdocs.yml",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
    "yarnrc.yml",
    ".yarn",
];

export function isFolderEmpty(root: string): {
    isEmpty: boolean;
    conflicts: Array<string>;
} {
    const conflicts = fs
        .readdirSync(root)
        .filter((file) => !VALID_FILES.includes(file))
        // Support IntelliJ IDEA-based editors
        .filter((file) => !file.endsWith(".iml"));

    return { isEmpty: conflicts.length === 0, conflicts };
}
