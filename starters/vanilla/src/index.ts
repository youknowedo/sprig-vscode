/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: test
@author: 
@tags: []
@addedOn: 2024-00-00
*/

import { otherFunc } from "./other.js";

const player = "p";

setLegend([
    player,
    bitmap`
................
................
.......000......
.......0.0......
......0..0......
......0...0.0...
....0003.30.0...
....0.0...000...
....0.05550.....
......0...0.....
.....0....0.....
.....0...0......
......000.......
......0.0.......
.....00.00......
................`,
]);

setSolids([]);

let level = 0;
const levels = [
    map`
p.
..`,
];

if (levels[level]) setMap(levels[level]);

setPushables({
    [player]: [],
});

onInput("s", () => {
    const p = getFirst(player);

    if (p) p.y += 1;
});

afterInput(() => {});

console.log("Hello from index!");

otherFunc();
