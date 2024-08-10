import { readFileSync, writeFileSync } from "fs";

export const postbuild = async () => {
    const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));

    const code = readFileSync("./dist/index.js", "utf-8");

    writeFileSync(
        "./dist/index.js",
        `/*
@title: ${pkgJson.name ?? ""}
@author: ${pkgJson.author ?? ""}
@tags: [${pkgJson.keywords?.join(",") ?? ""}]
@addedOn: ${new Date().toISOString().split("T")[0]}
@madeWith: SprigKit
*/

${code}`
    );
};
