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

const updateDecorations = () => {
    if (!activeEditor) {
        return;
    }
    const template = /(\S*)`((.|\s)*)`/g;
    const templateName = /(\S*)`/g;
    const text = activeEditor.document.getText();
    const colors: DecorationOptions[] = [];
    let match;
    while ((match = template.exec(text))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(
            match.index + match[0].length
        );

        const md = new MarkdownString(
            "[linku](command:sprigkit.openColorWebview)"
        );
        md.isTrusted = true;

        const decoration = {
            range: new Range(startPos, endPos),
            hoverMessage: md,
        };

        colors.push(decoration);
    }
    activeEditor.setDecorations(smallNumberDecorationType, colors);
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
