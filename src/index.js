import * as fs from 'fs'
import * as path from 'path'
import { createMacro, MacroError } from 'babel-plugin-macros'
import svgDataUri from 'mini-svg-data-uri'
import pkg from '../package.json'

const dataUriMacro = ({
  references,
  state: {
    file: {
      opts: { filename },
    },
  },
  babel: { types: t },
}) => {
  const usedReferences = Object.keys(references)

  if (usedReferences.length > 1 || usedReferences[0] !== 'default') {
    throw new MacroError(
      `${
        pkg.name
      } must be used as default import, instead you have used it as: ${usedReferences.join(
        ', ',
      )}.`,
    )
  }

  const converteesImports = new Set()

  references.default.forEach(({ parentPath: dataUriCall }) => {
    if (!dataUriCall.isCallExpression()) {
      throw new MacroError(
        `${
          pkg.name
        } should be used as function call, instead you have used it as part of ${
          dataUriCall.node.type
        }.`,
      )
    }

    const convertee = dataUriCall.get('arguments.0')

    if (!convertee.isIdentifier()) {
      throw new MacroError(
        `${
          pkg.name
        } must be used on imported identifier, instead you have used it on ${
          convertee.node.type
        }.`,
      )
    }

    const converteePath = convertee.scope.getBinding(convertee.get('name').node)
      .path

    if (!converteePath.isImportDefaultSpecifier()) {
      throw new MacroError(
        `${
          pkg.name
        } can convert only default imports, instead you have wanted to convert ${
          converteePath.node.type
        }.`,
      )
    }

    const converteeImportDeclaration = converteePath.parentPath
    converteesImports.add(converteeImportDeclaration)

    const importedPath = converteeImportDeclaration.get('source.value').node

    const requestingDir = path.dirname(filename)
    const requestedFile = path.resolve(requestingDir, importedPath)

    let dataUri

    // TODO: wrap with try/catch and throw nicer error
    if (path.extname(importedPath).toLowerCase() === '.svg') {
      const file = fs.readFileSync(requestedFile, 'utf-8')
      // TODO: optimize svg with svgo
      dataUri = svgDataUri(file)
    } else {
      const file = fs.readFileSync(requestedFile)
      // TODO: add data uri prefix
      dataUri = new Buffer(file).toString('base64')
    }

    dataUriCall.replaceWith(t.stringLiteral(dataUri))
  })

  converteesImports.forEach(importDeclaration => {
    importDeclaration.remove()
  })
}

export default createMacro(dataUriMacro)
