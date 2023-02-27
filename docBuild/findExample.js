import io from './io.js'

function isExample(extName) {
  return extName === '.vue'
}

export default function () {
  return io.getAllFiles()
    .filter(file => isExample(file.extName))
    .map(file => ({
      ...file,
      content: io.read(file.path)
    }))
}