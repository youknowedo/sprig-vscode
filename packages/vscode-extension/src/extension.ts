import fs from "fs";
import path from "path";
import * as vscode from "vscode";
import html from "vscode-webview/webview.html";

const exportRegex = /export[ ]?{[\S\s]*};?/g;

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand("sprigkit.start", () => {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel(
            "sprigKitGamePanel", // Identifies the type of the webview. Used internally
            "SprigKit Game Panel", // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {} // Webview options. More on these later.
        );
        panel.webview.options = {
            enableScripts: true,
        };

        const filePath = path.join(
            vscode.workspace.workspaceFolders?.[0].uri.fsPath || "",
            "dist/index.js"
        );
        const code = fs.readFileSync(filePath, "utf8");

        panel.webview.html = (html as string)
            .replace("{{GAME_CODE}}", code)
            .replaceAll(exportRegex, "");

        console.log(
            (html as string)
                .replace("{{GAME_CODE}}", code)
                .replaceAll(exportRegex, "")
        );

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
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
