import path from 'path'
// import fs from 'fs'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import fs from 'fs-extra'

const __filename = dirname(fileURLToPath(import.meta.url))

const sourceDocsPaths = path.resolve(__filename, '../docs')

const targetDocsPath = path.resolve(__filename, '../document')

function getFiles(filePath, list) {
  const dirs = fs.readdirSync(filePath)
  for (let dir of dirs) {
    const curPath = path.resolve(filePath, dir)
    if (fs.statSync(curPath).isDirectory()) {
      getFiles(curPath, list)
    }
    const extName = path.extname(dir)
    list.push({
      name: dir.replace(extName, ''),
      fileName: dir,
      path: curPath,
      extName,
    })
  }
}

export default {
  sourceDocsPaths,
  targetDocsPath,
  read(...paths) {
    return fs.readFileSync(path.resolve(...paths), { encoding: 'utf-8' })
  },
  write(content, ...paths) {
    fs.writeFileSync(path.resolve(...paths), content, { encoding: 'utf-8' })
  },
  getAllFiles() {
    const paths = []
    getFiles(sourceDocsPaths, paths)
    return paths
  },
  clearDocument() {
    fs.removeSync(targetDocsPath)
  },
  copyToTargetDocs() {
    fs.copySync(sourceDocsPaths, targetDocsPath)
  },
  remove(...paths) {
    fs.removeSync(path.resolve(...paths))
  }
}
