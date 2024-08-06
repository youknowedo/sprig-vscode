import { input, select } from "@inquirer/prompts";
import path from "node:path";

const directory = async (dir: string | undefined) => {
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
};

export const templates = ["vanilla"] as const;
export type Template = (typeof templates)[number];

const template = async (givenTemplate?: string) => {
    const selectedTemplate: Template =
        (givenTemplate != "default"
            ? templates.includes(givenTemplate as Template) &&
              (givenTemplate as Template)
            : "vanilla") ||
        (await select({
            message: "Which template would you like to use?",
            choices: templates.map((value) => {
                const name = value
                    .split("-")
                    .map((s) => s[0].toUpperCase() + s.substring(1))
                    .join(" ");

                return {
                    name,
                    value,
                };
            }),
        }));

    return selectedTemplate;
};

export default {
    directory,
    template,
};
