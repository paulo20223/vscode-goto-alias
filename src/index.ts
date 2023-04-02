import type { TextDocument } from 'vscode'
import { Position, Selection, commands, languages, window } from 'vscode'
import { setTimeout } from "timers/promises";


export function activate() {
  let goToFile: TextDocument | undefined

  languages.registerDefinitionProvider([
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact',
    'vue',
  ], {
    provideDefinition(document: TextDocument) {
      goToFile = document
      return null
    },
  })

  window.onDidChangeActiveTextEditor(async (e) => {
    if (!e || !e.document)
      return

    const fn = async () => {

      const path = e.document.uri.fsPath

      if (goToFile && path.endsWith('components.d.ts')) {
        goToFile = undefined
      } else {
        return
      }

      await Promise.resolve()
      await setTimeout(100);

      const line = e.document.lineAt(e.selection.anchor.line)
      const text = line.text
      const regex = /:\s+typeof import\(.*?\)/
      const match = text.match(regex)
      if (!match)
        return

      e.selection = new Selection(
        new Position(
          e.selection.anchor.line,
          match.index! + match[0].length,
        ),
        new Position(
          e.selection.anchor.line,
          match.index! + match[0].length + 1,
        ),
      )
      await commands.executeCommand('editor.action.goToDeclaration')

    }

    await fn()
    await Promise.resolve()
  })
}

export function deactivate() {

}
