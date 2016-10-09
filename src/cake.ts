import * as vscode from "vscode";

export class Cake {
    
    staticBarItem: vscode.StatusBarItem;
    tasks: vscode.QuickPickItem[] = [];
    watcher: vscode.FileSystemWatcher; 
    
    constructor() {
        this.tasks.push({ label:"./build.sh --target Default", description: "A"});
        this.initialize();
        this.register();
    }

    private register() {
        vscode.commands.registerCommand("cakeRunner.showTasks", () => {
            this.showTasks();
        });
    }
    
    updateTask(file: vscode.Uri) {
        let open = vscode.workspace.openTextDocument(file.fsPath);
        open.then(file => {
            let text = file.getText();
            console.log(text);
        });
    }
    
    private initializeTasks() {
        let find = vscode.workspace.findFiles("build.cake", "", 1);
        find.then(files => {
            if(files.length > 0) this.updateTask(files[0]);
        })
    }
    
    private runCommand(result) {
         let editor = vscode.window.activeTextEditor;
         let document = editor.document;
         let eol = editor.document.lineCount + 1;
         let position = editor.selection.active;
         var startPos = new vscode.Position(eol, 0);
         var endPos = new vscode.Position(eol, result.length);
         var selStartPos = new vscode.Position(eol - 1, 0);
         var newSelection = new vscode.Selection(selStartPos, endPos);
        editor.edit(function (edits) {
            edits.insert(startPos, '\n' + result);
        }).then(function () {
            editor.selection = newSelection;
            vscode.commands.executeCommand('workbench.action.terminal.runSelectedText');
            vscode.commands.executeCommand('undo');
        }, function () {
            vscode.window.showErrorMessage("Unable to run task");
        })
    }

    private initialize() {
        this.initializeTasks();
        this.watcher = vscode.workspace.createFileSystemWatcher("**/*.cake");
        this.watcher.onDidChange(file => {
            this.updateTask(file);
        });

        if(!this.staticBarItem) {
            this.staticBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            this.staticBarItem.text = "Cake";
            this.staticBarItem.command = "cakeRunner.showTasks";
            this.staticBarItem.show();
        }
    }
    
    private showTasks() {
        let options = { placeholder : "Enter task name"};
        let quickPick = vscode.window.showQuickPick(this.tasks, options);
        quickPick.then(result => {
            var task = result.label;
            this.runCommand(task);
        });
    }
    
    dispose() {
        this.watcher.dispose();
        this.staticBarItem.dispose();
        this.tasks = [];
    }
}