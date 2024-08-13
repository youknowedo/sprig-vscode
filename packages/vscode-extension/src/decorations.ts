import {
    DecorationOptions,
    MarkdownString,
    OverviewRulerLane,
    Range,
    window,
} from "vscode";
import { activeEditor } from "./extension";

let timeout: NodeJS.Timeout | undefined = undefined;

const smallNumberDecorationType = window.createTextEditorDecorationType({
    borderWidth: "1px",
    borderStyle: "solid",
    overviewRulerColor: "blue",
    overviewRulerLane: OverviewRulerLane.Right,
    light: {
        borderColor: "darkblue",
    },
    dark: {
        borderColor: "lightblue",
    },
    after: {},
});

const largeNumberDecorationType = window.createTextEditorDecorationType({
    cursor: "crosshair",
    backgroundColor: { id: "myextension.largeNumberBackground" },
});

const updateDecorations = () => {
    if (!activeEditor) {
        return;
    }
    const regEx = /\d+/g;
    const text = activeEditor.document.getText();
    const smallNumbers: DecorationOptions[] = [];
    const largeNumbers: DecorationOptions[] = [];
    let match;
    while ((match = regEx.exec(text))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(
            match.index + match[0].length
        );

        const md = new MarkdownString(
            "[linku](command:sprigkit.openFromWorkspace)"
        );
        md.isTrusted = true;

        const decoration = {
            range: new Range(startPos, endPos),
            hoverMessage: md,
        };
        if (match[0].length < 3) {
            smallNumbers.push(decoration);
        } else {
            largeNumbers.push(decoration);
        }
    }
    activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
    activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);
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
