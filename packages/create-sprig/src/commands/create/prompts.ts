import { input, select } from "@inquirer/prompts";
import path from "node:path";

const directory = async (dir: string | undefined) => {
    const projectDir =
        dir && dir != "."
            ? dir
            : await input({
                  message: "Where would you like to create your Sprig project?",
                  default: dir ?? "./sprig-project",

                  transformer: (value, { isFinal }) => {
                      if (isFinal) {
                          return value.trim();
                      }
                      return value;
                  },
              });

    const root = path.resolve(projectDir);
    const projectName = path.basename(root);

    return { root, projectName };
};

export default {
    directory,
};
