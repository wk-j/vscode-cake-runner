import * as vscode from "vscode"
import { Cake } from "./cake"
import { Executor } from "./executor"

export function activate(context: vscode.ExtensionContext) {
    if ("onDidCloseTerminal" in vscode.window as any) {
        (vscode.window as any).onDidCloseTerminal((terminal) => {
            Executor.onDidCloseTerminal(terminal)
        });
    }

    let cake = new Cake()
    context.subscriptions.push(cake)
}

export function deactivate() { }