import type { WebEngineAPI } from "sprig/web";

export type { WebEngineAPI };

export class Sprout {
    constructor() {}

    started = false;
    #api: WebEngineAPI | null = null;

    #onStart: (api: WebEngineAPI) => void = () => {};
    setStart: (f: (api: WebEngineAPI) => void) => void = (f) => {
        this.#onStart = f;
    };

    setInterval(f: (api: WebEngineAPI) => void, ms: number) {
        return setInterval(() => {
            if (this.started && this.#api) {
                f(this.#api);
            }
        }, ms);
    }

    start(api: WebEngineAPI) {
        this.#api = api;

        this.#onStart(api);
    }
}
