import { player } from ".";

export const moveDown = () => {
    const p = getFirst(player);

    if (p) p.y += 1;
};
