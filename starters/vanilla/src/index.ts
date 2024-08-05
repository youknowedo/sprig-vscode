/*
@title: 2P Snake
@author: Sigfredo
@tags: ["snake", "multiplayer"]
@addedOn: 2024-00-00
*/

import { registerInputs } from "./inputs.js";

let level = 0;
const levels = [
    map`
p.
..`,
];

if (levels[level]) setMap(levels[level]);
else console.error("Level not found");

registerInputs();
