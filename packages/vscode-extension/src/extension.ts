import {
    commands,
    ExtensionContext,
    OutputChannel,
    window,
    workspace,
} from "vscode";
import { openColorWebview } from "./colorWebview";
import { triggerUpdateDecorations } from "./decorations";
import { openGameWebview } from "./gameWebview";

export let activeEditor = window.activeTextEditor;
export let output: OutputChannel;

export function activate(context: ExtensionContext) {
    output = window.createOutputChannel("SprigKit");

    const openGameFromWorkspace = commands.registerCommand(
        "sprigkit.openFromWorkspace",
        (editor) => openGameWebview(context, editor)
    );
    const openGameFromFile = commands.registerTextEditorCommand(
        "sprigkit.openFromFile",
        (editor) => openGameWebview(context, editor)
    );

    const openColorPanel = commands.registerCommand(
        "sprigkit.openColorWebview",
        (editor) => openColorWebview(context, editor)
    );

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        },
        null,
        context.subscriptions
    );

    workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations(true);
            }
        },
        null,
        context.subscriptions
    );

    context.subscriptions.push(
        openGameFromWorkspace,
        openGameFromFile,
        openColorPanel
    );
}

export function deactivate() {}
