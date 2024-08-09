import fs from "fs";
import path from "path";
import * as vscode from "vscode";
import html from "vscode-webview/webview.html";

const exportRegex = /export[ ]?{[\S\s]*};?/g;

export function activate(context: vscode.ExtensionContext) {
    // TODO: make anothr non text editor command for only workspaces
    const disposable = vscode.commands.registerTextEditorCommand(
        "sprigkit.start",
        (editor) => {
            // Create and show a new webview
            const panel = vscode.window.createWebviewPanel(
                "sprigKitGamePanel", // Identifies the type of the webview. Used internally
                "SprigKit Game Panel", // Title of the panel displayed to the user
                vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
                {} // Webview options. More on these later.
            );
            panel.webview.options = {
                enableScripts: true,
            };

            let code: string | undefined = undefined;

            const logoOnDiskPath = vscode.Uri.joinPath(
                context.extensionUri,
                "images",
                "sprigkit.png"
            );
            // And get the special URI to use with the webview
            const logoSrc = panel.webview.asWebviewUri(logoOnDiskPath);

            let sprigkitConsole = vscode.window.createOutputChannel("SprigKit");

            sprigkitConsole.show();

            panel.webview.onDidReceiveMessage(
                (message) => {
                    switch (message.command) {
                        case "log":
                            sprigkitConsole.appendLine(message.text);
                            return;
                    }
                },
                undefined,
                context.subscriptions
            );

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders?.[0]) {
                sprigkitConsole.appendLine(
                    "[Kit] No workspace folder found. Loading code on save."
                );

                code = editor.document.getText();

                const fileSave = vscode.workspace.onDidSaveTextDocument(
                    (document) => {
                        if (document === editor.document) {
                            code = document.getText();
                            panel.webview.postMessage({
                                command: "update",
                                code: code.replace(exportRegex, ""),
                            });
                        }
                    }
                );

                context.subscriptions.push(fileSave);
            } else {
                sprigkitConsole.appendLine(
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
                });
                distWatcher.onDidCreate((e) => {
                    code = fs.readFileSync(filePath, "utf8");
                    panel.webview.postMessage({
                        command: "update",
                        code: code.replace(exportRegex, ""),
                    });
                });
            }

            panel.webview.html = (html as string)
                .replace("{{GAME_CODE}}", code)
                .replaceAll(exportRegex, "")
                .replace("{{LOGO_SRC}}", logoSrc.toString());
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
