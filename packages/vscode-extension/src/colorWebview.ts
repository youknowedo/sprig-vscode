import path from "path";
import {
    ExtensionContext,
    Position,
    Range,
    TextEditor,
    TextEditorEdit,
    Uri,
    ViewColumn,
    WebviewPanel,
    window,
    workspace,
} from "vscode";
import html from "vscode-webview/webview.html";
import { output } from "./extension";

let openPanels: WebviewPanel[] = [];

export const openColorWebview = (
    context: ExtensionContext,
    editor: TextEditor,
    startPos: Position,
    endPos: Position,
    currentColor: string
) => {
    const panel = window.createWebviewPanel(
        "sprigKitGamePanel",
        "SprigKit: Color",
        ViewColumn.Two,
        {
            enableScripts: true,
        }
    );
    openPanels.push(panel);

    window.onDidChangeActiveTextEditor(
        (editor) => {
            if (editor) {
                openPanels.forEach((panel) => {
                    panel.dispose();
                });
                openPanels = [];
            }
        },
        null,
        context.subscriptions
    );

    panel.webview.onDidReceiveMessage(
        (message) => {
            console.log("Received message: ", message);
            switch (message.command) {
                case "newValue":
                    console.log("New: ", message.value);
                    try {
                        editor.edit((edit: TextEditorEdit) => {
                            edit.replace(
                                editor.document.validateRange(
                                    new Range(startPos, endPos)
                                ),
                                `color\`${message.value}\``
                            );
                        });
                    } catch (e) {
                        console.log(e);
                    }
                    console.log("New value: ", message.value);
                    return;
            }
        },
        undefined,
        context.subscriptions
    );

    panel.iconPath = Uri.file(context.asAbsolutePath("images/sprig.png"));
    panel.reveal();

    panel.webview.html = (html as string)
        .replace("{{PAGE_ID}}", "color")
        .replace(
            "{{DATA}}",
            JSON.stringify({ startPos, endPos, currentColor })
        );
};
