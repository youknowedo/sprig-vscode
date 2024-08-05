export const create = (
    commandArgument: string | undefined,
    options: {
        packageManager?: "npm" | "yarn" | "pnpm" | "bun";
        skipInstall?: boolean;
        template?: "vanilla" | undefined;
    }
) => {};
