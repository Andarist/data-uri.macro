import * as fs from 'fs'
import * as path from 'path'
import { createMacro, MacroError } from 'babel-plugin-macros'
import { lookup as mimeLookup } from 'mime-types'
import svgDataUri from 'mini-svg-data-uri'
import pkg from '../package.json'

const getDataUri = filePath => {
  if (path.extname(filePath).toLowerCase() === '.svg') {
    const file = fs.readFileSync(filePath, 'utf-8')
    return svgDataUri(file)
  }

  const file = fs.readFileSync(filePath)
  return `data:${mimeLookup(filePath)};base64,${new Buffer(file).toString(
    'base64',
  )}`
}

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

    let filePath

    if (convertee.isStringLiteral()) {
      filePath = convertee.node.value
    } else if (convertee.isIdentifier()) {
      const converteePath = convertee.scope.getBinding(
        convertee.get('name').node,
      ).path

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

      filePath = converteeImportDeclaration.get('source.value').node
    } else {
      throw new MacroError(
        `${
          pkg.name
        } must be used on string literal or imported identifier, instead you have used it on ${
          convertee.node.type
        }.`,
      )
    }

    const requestedFile = path.resolve(path.dirname(filename), filePath)
    dataUriCall.replaceWith(t.stringLiteral(getDataUri(requestedFile)))
  })

  converteesImports.forEach(importDeclaration => {
    importDeclaration.remove()
  })
}

export default createMacro(dataUriMacro)
