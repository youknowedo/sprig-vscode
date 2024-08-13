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

let workspacePanel: WebviewPanel | undefined = undefined;

export const openColorWebview = (
    context: ExtensionContext,
    editor: TextEditor,
    edit: TextEditorEdit,
    startPos: Position,
    endPos: Position,
    currentColor: string
) => {
    const panel =
        editor || !workspacePanel
            ? window.createWebviewPanel(
                  "sprigKitGamePanel",
                  "SprigKit: Color",
                  ViewColumn.Two,
                  {
                      enableScripts: true,
                  }
              )
            : workspacePanel;

    panel.webview.onDidReceiveMessage(
        (message) => {
            switch (message.command) {
                case "newValue":
                    edit.replace(
                        editor.document.validateRange(
                            new Range(startPos, endPos)
                        ),
                        `color\`${message.value}\``
                    );
                    return;
            }
        },
        undefined,
        context.subscriptions
    );

    panel.iconPath = Uri.file(context.asAbsolutePath("images/sprig.png"));
    if (!workspacePanel && !editor) {
        workspacePanel = panel;
    }
    panel.reveal();

    panel.webview.html = (html as string).replace("{{PAGE_ID}}", "color");
};
