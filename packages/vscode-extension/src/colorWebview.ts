import path from "path";
import {
    ExtensionContext,
    TextEditor,
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
    editor?: TextEditor
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

    output.appendLine("Opening color webview");
    output.appendLine((html as string).replace("{{PAGE_ID}}", "color"));

    panel.iconPath = Uri.file(context.asAbsolutePath("images/sprig.png"));
    if (!workspacePanel && !editor) {
        workspacePanel = panel;
    }
    panel.reveal();

    panel.webview.html = (html as string).replace("{{PAGE_ID}}", "color");
};
