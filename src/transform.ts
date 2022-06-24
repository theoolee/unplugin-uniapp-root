import { Options } from './types'
import { parseSync, traverse } from '@babel/core'
import {
  identifier,
  objectProperty,
  importDefaultSpecifier,
  importDeclaration,
  stringLiteral,
  objectExpression,
  exportDefaultDeclaration,
  ObjectExpression,
} from '@babel/types'
import generate from '@babel/generator'

function processScript(code: string, options: Required<Options>) {
  const componentVarName = `__${options.componentName}__`
  const componentImportNode = importDeclaration(
    [importDefaultSpecifier(identifier(componentVarName))],
    stringLiteral(options.componentPath)
  )
  const componentPropertyNode = objectProperty(
    identifier(options.componentName),
    identifier(componentVarName)
  )
  const componentsPropertyNode = objectProperty(
    identifier('components'),
    objectExpression([componentPropertyNode])
  )
  const result = /(.*?)(<[^\/]*?script.*?>)(.*)(<\/.*?script.*?>)(.*)/s.exec(
    code
  )
  if (result) {
    const [_, before, frontTag, content, backTag, after] = result
    const ast = parseSync(content, {
      filename: '_.ts',
      configFile: false,
      presets: ['@babel/preset-typescript'],
    })
    if (ast) {
      let hasDefaultExport = false
      let isTransformed = false
      traverse(ast, {
        ExportDefaultDeclaration(path) {
          const { declaration } = path.node
          let objectExpression: ObjectExpression | null = null
          switch (declaration.type) {
            case 'ObjectExpression':
              objectExpression = declaration
              break
            case 'CallExpression':
              const firstArg = declaration.arguments[0]
              if (firstArg.type === 'ObjectExpression') {
                objectExpression = firstArg
              }
              break
          }
          if (!objectExpression) {
            return
          }
          const hasComponents = objectExpression.properties.some((property) => {
            if (
              property.type === 'ObjectProperty' &&
              property.key.type === 'Identifier' &&
              property.key.name === 'components' &&
              property.value.type === 'ObjectExpression'
            ) {
              const hasComponent = property.value.properties.some((p) => {
                if (
                  p.type === 'ObjectProperty' &&
                  p.key.type === 'Identifier' &&
                  p.key.name === options.componentName
                ) {
                  isTransformed = true
                  return true
                }
              })
              if (!hasComponent) {
                property.value.properties.push(componentPropertyNode)
              }
              return true
            }
          })
          if (!hasComponents) {
            objectExpression.properties.push(componentsPropertyNode)
          }
          hasDefaultExport = true
        },
      })
      if (!hasDefaultExport) {
        ast.program.body.push(
          exportDefaultDeclaration(objectExpression([componentsPropertyNode]))
        )
      }
      if (!isTransformed) {
        ast.program.body.unshift(componentImportNode)
        return `${before}${frontTag}${generate(ast).code}${backTag}${after}`
      }
    }
  }
  return code
}

function processTemplate(code: string, options: Required<Options>) {
  const result =
    /(.*?)(<[^\/]*?template.*?>)(.*)(<\/.*?template.*?>)(.*)/s.exec(code)
  if (result) {
    let [_, before, frontTag, content, backTag, after] = result
    const isTransformed = new RegExp(
      `.*<${options.componentName}>.*?<\/${options.componentName}>.*`,
      's'
    ).test(content)
    if (!isTransformed) {
      return `${before}${frontTag}<${options.componentName}>${content}</${options.componentName}>${backTag}${after}`
    }
  }
  return code
}

export default function (code: string, options: Required<Options>): string {
  let newCode = processScript(code, options)
  newCode = processTemplate(newCode, options)
  return newCode
}
