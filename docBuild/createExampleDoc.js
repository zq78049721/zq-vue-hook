import io from './io.js'

const exampleTemplateCode = io.read(io.sourceDocsPaths, 'exampleTemplate.md')
const indexHtmlTemplateCode = io.read(io.sourceDocsPaths, 'indexSource.html')

export default function (exampleFiles) {
  io.clearDocument()
  io.copyToTargetDocs()
  io.remove(io.targetDocsPath, 'exampleTemplate.md')
  io.remove(io.targetDocsPath, 'indexSource.html')
  exampleFiles.forEach(file => {
    const { path, processed, name } = file
    const { template, script, exampleName } = processed
    const targetPath = path.replace('docs', 'document')//.replace('.vue', '.md');
    io.remove(targetPath)
    const content = exampleTemplateCode
      .replace('{name}', name)
      .replace('{html}', template)
      .replace('{javascript}', script)
      .replace('{components}', `<${exampleName}/>`)
    io.write(content, targetPath.replace('.vue', '.md'))
  });

  const docCode = indexHtmlTemplateCode.replace('//componentsCode', exampleFiles.map(file => file.processed.output).join('\n'))
  io.write(docCode, io.targetDocsPath, 'index.html')
}

