import fs from "fs";
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

const exportRegex = /export[ ]?{[\S\s]*};?/g;
let workspacePanel: WebviewPanel | undefined = undefined;

export const openGameWebview = (
    context: ExtensionContext,
    editor?: TextEditor
) => {
    const panel =
        editor || !workspacePanel
            ? window.createWebviewPanel(
                  "sprigKitGamePanel",
                  "SprigKit: " +
                      ((editor && path.basename(editor?.document.fileName)) ??
                          "Workspace"),
                  ViewColumn.Two,
                  {
                      enableScripts: true,
                  }
              )
            : workspacePanel;

    if (!workspacePanel && !editor) {
        workspacePanel = panel;

        workspacePanel.onDidDispose(
            () => {
                workspacePanel = undefined;
            },
            null,
            context.subscriptions
        );
    }

    panel.iconPath = Uri.file(context.asAbsolutePath("images/sprig.png"));
    panel.reveal();
    output.show();

    let code: string | undefined = undefined;

    const logoOnDiskPath = Uri.joinPath(
        context.extensionUri,
        "images",
        "sprigkit.png"
    );
    // And get the special URI to use with the webview
    const logoSrc = panel.webview.asWebviewUri(logoOnDiskPath);

    output.show();

    panel.webview.onDidReceiveMessage(
        (message) => {
            switch (message.command) {
                case "log":
                    output.appendLine(message.text);
                    return;
            }
        },
        undefined,
        context.subscriptions
    );

    if (editor) {
        output.appendLine(
            "[Kit] Loading game code from " + editor.document.fileName
        );

        code = editor.document.getText();

        const fileSave = workspace.onDidSaveTextDocument((document) => {
            if (document === editor.document) {
                code = document.getText();
                panel.webview.postMessage({
                    command: "update",
                    code: code.replace(exportRegex, ""),
                });
                output.appendLine(
                    "[Kit] Updated game code. Restart to see changes."
                );
            }
        });

        context.subscriptions.push(fileSave);
    } else {
        const workspaceFolders = workspace.workspaceFolders;
        if (!workspaceFolders?.[0]) {
            output.appendLine(
                "[Kit] No workspace folder found. Please open a workspace folder"
            );
            window.showErrorMessage(
                "No workspace folder found. Please open a workspace folder"
            );
            return;
        } else {
            output.appendLine(
                "[Kit] Workspace folder found. Loading dist/index.js"
            );

            const filePath = path.join(
                workspaceFolders[0].uri.fsPath || "",
                "dist/index.js"
            );
            code = fs.readFileSync(filePath, "utf8");

            const distWatcher = workspace.createFileSystemWatcher(filePath);
            distWatcher.onDidChange((e) => {
                code = fs.readFileSync(filePath, "utf8");
                panel.webview.postMessage({
                    command: "update",
                    code: code.replace(exportRegex, ""),
                });

                output.appendLine(
                    "[Kit] Updated game code. Restart to see changes."
                );
            });
            distWatcher.onDidCreate((e) => {
                code = fs.readFileSync(filePath, "utf8");
                panel.webview.postMessage({
                    command: "update",
                    code: code.replace(exportRegex, ""),
                });

                output.appendLine(
                    "[Kit] Updated game code. Restart to see changes."
                );
            });
        }
    }

    panel.webview.html = (html as string)
        .replace("{{GAME_CODE}}", code)
        .replaceAll(exportRegex, "")
        .replace("{{LOGO_SRC}}", logoSrc.toString());
};
