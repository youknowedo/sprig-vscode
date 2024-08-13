import { WebEngineAPI } from "sprig/web";

declare global {
    function bitmap(
        ...args: Parameters<WebEngineAPI["bitmap"]>
    ): ReturnType<WebEngineAPI["bitmap"]>;
    function map(
        ...args: Parameters<WebEngineAPI["map"]>
    ): ReturnType<WebEngineAPI["map"]>;
    function color(
        ...args: Parameters<WebEngineAPI["color"]>
    ): ReturnType<WebEngineAPI["color"]>;
    function tune(
        ...args: Parameters<WebEngineAPI["tune"]>
    ): ReturnType<WebEngineAPI["tune"]>;

    function setLegend(
        ...args: Parameters<WebEngineAPI["setLegend"]>
    ): ReturnType<WebEngineAPI["setLegend"]>;
    function setBackground(
        ...args: Parameters<WebEngineAPI["setBackground"]>
    ): ReturnType<WebEngineAPI["setBackground"]>;
    function setMap(
        ...args: Parameters<WebEngineAPI["setMap"]>
    ): ReturnType<WebEngineAPI["setMap"]>;
    function setSolids(
        ...args: Parameters<WebEngineAPI["setSolids"]>
    ): ReturnType<WebEngineAPI["setSolids"]>;
    function setPushables(
        ...args: Parameters<WebEngineAPI["setPushables"]>
    ): ReturnType<WebEngineAPI["setPushables"]>;
    function width(): ReturnType<WebEngineAPI["width"]>;
    function height(): ReturnType<WebEngineAPI["height"]>;

    function onInput(
        ...args: Parameters<WebEngineAPI["onInput"]>
    ): ReturnType<WebEngineAPI["onInput"]>;
    function afterInput(
        ...args: Parameters<WebEngineAPI["afterInput"]>
    ): ReturnType<WebEngineAPI["afterInput"]>;

    function getTile(
        ...args: Parameters<WebEngineAPI["getTile"]>
    ): ReturnType<WebEngineAPI["getTile"]>;
    function tilesWith(
        ...args: Parameters<WebEngineAPI["tilesWith"]>
    ): ReturnType<WebEngineAPI["tilesWith"]>;
    function addSprite(
        ...args: Parameters<WebEngineAPI["addSprite"]>
    ): ReturnType<WebEngineAPI["addSprite"]>;
    function clearTile(
        ...args: Parameters<WebEngineAPI["clearTile"]>
    ): ReturnType<WebEngineAPI["clearTile"]>;
    function getAll(
        ...args: Parameters<WebEngineAPI["getAll"]>
    ): ReturnType<WebEngineAPI["getAll"]>;
    function getFirst(
        ...args: Parameters<WebEngineAPI["getFirst"]>
    ): ReturnType<WebEngineAPI["getFirst"]>;

    function addText(
        ...args: Parameters<WebEngineAPI["addText"]>
    ): ReturnType<WebEngineAPI["addText"]>;
    function clearText(): ReturnType<WebEngineAPI["clearText"]>;

    function playTune(
        ...args: Parameters<WebEngineAPI["playTune"]>
    ): ReturnType<WebEngineAPI["playTune"]>;
}

export {};
