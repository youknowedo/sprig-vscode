import { player } from "./sprites.js";

export const registerInputs = () => {
    onInput("s", () => {
        const p = getFirst(player);
        if (!p) return;

        p.y += 1;
    });

    afterInput(() => {});
};
