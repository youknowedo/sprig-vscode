import { input, select } from "@inquirer/prompts";
import path from "node:path";

async function directory(dir: string | undefined) {
    const projectDir =
        dir ??
        (await input({
            message: "Where would you like to create your Turborepo?",
            default: "./my-turborepo",

            transformer: (value, { isFinal }) => {
                if (isFinal) {
                    return value.trim();
                }
                return value;
            },
        }));

    const root = path.resolve(projectDir);
    const projectName = path.basename(root);

    return { root, projectName };
}

export default {
    directory,
};
