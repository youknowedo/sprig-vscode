import fs from "fs";
import path from "path";
import * as vscode from "vscode";
import html from "vscode-webview/webview.html";

const exportRegex = /export[ ]?{[\S\s]*};?/g;
let output: vscode.OutputChannel;
let workspacePanel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
    output = vscode.window.createOutputChannel("SprigKit");

    const openFromWorkspace = vscode.commands.registerCommand(
        "sprigkit.openFromWorkspace",
        (editor) => openWebview(context, editor)
    );
    const openFromFile = vscode.commands.registerTextEditorCommand(
        "sprigkit.openFromFile",
        (editor) => openWebview(context, editor)
    );

    context.subscriptions.push(openFromWorkspace, openFromFile);
}

const openWebview = (
    context: vscode.ExtensionContext,
    editor?: vscode.TextEditor
) => {
    const panel =
        editor || !workspacePanel
            ? vscode.window.createWebviewPanel(
                  "sprigKitGamePanel",
                  "SprigKit: " +
                      ((editor && path.basename(editor?.document.fileName)) ??
                          "Workspace"),
                  vscode.ViewColumn.Two,
                  {
                      enableScripts: true,
                  }
              )
            : workspacePanel;

    panel.iconPath = vscode.Uri.file(
        context.asAbsolutePath("images/sprig.png")
    );
    if (!workspacePanel && !editor) {
        workspacePanel = panel;
    }
    panel.reveal();
    output.show();

    let code: string | undefined = undefined;

    const logoOnDiskPath = vscode.Uri.joinPath(
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

        const fileSave = vscode.workspace.onDidSaveTextDocument((document) => {
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
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders?.[0]) {
            output.appendLine(
                "[Kit] No workspace folder found. Please open a workspace folder"
            );
            vscode.window.showErrorMessage(
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

            const distWatcher =
                vscode.workspace.createFileSystemWatcher(filePath);
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

export function deactivate() {}
