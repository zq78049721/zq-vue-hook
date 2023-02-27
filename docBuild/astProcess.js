import traverse from '@babel/traverse'
import t from '@babel/types';
import generate from "@babel/generator";
import { parseSync } from '@babel/core'

function processImport(path, imports) {
  const { node } = path;
  const { specifiers, source } = node;
  if (['vue', 'zq-vue-hook'].includes(source.value)) {
    const defaultVar = specifiers.filter(sp => !sp.imported).map(sp => sp.local.name)[0]
    const otherVars = specifiers.filter(sp => sp.imported).map(sp => sp.imported.name)
    imports.push({
      from: source.value === 'zq-vue-hook' ? 'ZqVueHook' : 'Vue',
      defaultVar,
      otherVars,
    })
    path.remove()
  }
}

function importConvertVariable(path, imports) {
  if (path.node.key.name === 'setup') {
    imports.forEach((item) => {
      const left = t.objectPattern(item.otherVars.map(name => t.objectProperty(t.identifier(name), t.identifier(name), false, true)))
      const statement = t.variableDeclaration('const', [
        t.variableDeclarator(left, t.identifier(item.from))
      ])
      path.get('body').unshiftContainer('body', statement)
      if (item.defaultVar) {
        const defaultStatement = t.variableDeclaration('const',
          [t.variableDeclarator(t.identifier(item.defaultVar), t.identifier(item.from))])
        path.get('body').unshiftContainer('body', defaultStatement)
      }
    })
  }
}

function appendTemplate(path, template) {
  const statement = t.objectProperty(t.identifier('template'), t.stringLiteral(template))
  path.node.declaration.properties.push(statement)
}

export default function (sourceCode, templateCode) {
  const imports = []
  const ast = parseSync(sourceCode)
  traverse.default(ast, {
    ImportDeclaration(path) {
      processImport(path, imports)
    },
    ObjectMethod(path) {
      path.node.key.name === 'setup' && importConvertVariable(path, imports)
    },
    ExportDefaultDeclaration(path) {
      appendTemplate(path, templateCode)
    }
  })
  return {
    sourceCode,
    outputCode: generate.default(ast).code
  }
}
