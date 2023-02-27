import findExample from "./findExample.js";
import codeProcess from "./codeProcess.js";
import createExampleDoc from "./createExampleDoc.js";

console.log('building...')

const result = codeProcess(findExample())

createExampleDoc(result)

console.log('done')