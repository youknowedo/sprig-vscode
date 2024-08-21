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
} from "vscode";
import html from "vscode-webview/webview.html";

let openPanels: WebviewPanel[] = [];

export const openBitmapWebview = (
    context: ExtensionContext,
    editor: TextEditor,
    startPos: Position,
    endPos: Position,
    currentBitmap: string
) => {
    const panel = window.createWebviewPanel(
        "sprigKitGamePanel",
        "SprigKit: Bitmap",
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
                                `bitmap\`${message.value}\``
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
        .replace("{{PAGE_ID}}", "bitmap")
        .replace(
            "{{DATA}}",
            JSON.stringify({ startPos, endPos, currentBitmap })
        );
};
