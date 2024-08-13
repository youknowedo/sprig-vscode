import * as vscode from "vscode";
import { openGameWebview } from "./gameWebview";

export let output: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    output = vscode.window.createOutputChannel("SprigKit");

    const openFromWorkspace = vscode.commands.registerCommand(
        "sprigkit.openFromWorkspace",
        (editor) => openGameWebview(context, editor)
    );
    const openFromFile = vscode.commands.registerTextEditorCommand(
        "sprigkit.openFromFile",
        (editor) => openGameWebview(context, editor)
    );

    context.subscriptions.push(openFromWorkspace, openFromFile);
}

export function deactivate() {}
