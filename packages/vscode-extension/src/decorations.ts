import {
    DecorationOptions,
    MarkdownString,
    OverviewRulerLane,
    Range,
    window,
} from "vscode";
import { activeEditor } from "./extension";

let timeout: NodeJS.Timeout | undefined = undefined;

const colorHoverDecorations = window.createTextEditorDecorationType({});
const badgeDecorations = window.createTextEditorDecorationType({
    backgroundColor: "#FF9D07",
    color: "black",
    borderRadius: "2px",
});

const updateDecorations = () => {
    if (!activeEditor) {
        return;
    }
    const template = /([a-zA-Z]+)`(.|\s)*?`/g;
    const text = activeEditor.document.getText();
    const colorHovers: DecorationOptions[] = [];
    const badges: DecorationOptions[] = [];
    let match;
    while ((match = template.exec(text))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(
            match.index + match[0].length
        );

        console.log(match);

        const hoverMessage = (command: string) => {
            const md = new MarkdownString(`[Edit in GUI](command:${command})`);
            md.isTrusted = true;

            return md;
        };

        switch (match[1]) {
            case "color":
                colorHovers.push({
                    range: new Range(startPos, endPos),
                    hoverMessage: hoverMessage("sprigkit.openColorWebview"),
                });
                break;
        }

        badges.push({
            range: new Range(startPos, startPos.translate(0, match[1].length)),
        });
    }
    activeEditor.setDecorations(colorHoverDecorations, colorHovers);
    activeEditor.setDecorations(badgeDecorations, badges);
};

export const triggerUpdateDecorations = (throttle = false) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    }
    if (throttle) {
        timeout = setTimeout(updateDecorations, 500);
    } else {
        updateDecorations();
    }
};
