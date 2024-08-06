/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: test
@author: 
@tags: []
@addedOn: 2024-00-00
*/

import { Sprout } from "@repo/sprout";
import { initializePlayer, player } from "./player";

const { setStart, setInterval } = new Sprout();

let level = 0;
let levels;

// Runs once at the start
setStart((api) => {
    const { setLegend, bitmap, setSolids, setPushables, map } = api;

    setSolids([]);
    setPushables({
        [player]: [],
    });

    levels = [
        map`
p.
..`,
    ];

    initializePlayer(api);
});

// Runs every second
setInterval((api) => {}, 1000);
