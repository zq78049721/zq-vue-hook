import compiler from '@vue/compiler-sfc'
import astProcess from './astProcess.js'

let exampleIndex = 1;

export default function (pathsInfo) {
  pathsInfo.map(info => {
    const { content } = info
    const { descriptor } = compiler.parse(content)
    const { template, script } = descriptor
    const exampleName = `example${exampleIndex++}`
    let { outputCode } = astProcess(script.content, template.content)
    outputCode = compiler.rewriteDefault(outputCode, exampleName)
    outputCode += `\n vueComponents.${exampleName}=${exampleName};\n`
    info.processed = {
      template: template.content,
      script: script.content,
      output: outputCode,
      exampleName
    }
  })
  return pathsInfo
}