import * as vscode from "vscode";
import html from "vscode-webview/webview.html";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand("sprigkit.start", () => {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel(
            "sprigKitGamePanel", // Identifies the type of the webview. Used internally
            "SprigKit Game Panel", // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {} // Webview options. More on these later.
        );

        panel.webview.html = html;
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
