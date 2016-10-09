'use strict';

import * as vscode from 'vscode';
import { Cake } from "./cake";

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vscode-cake-runner" is now active!');

    let cake = new Cake();

    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}