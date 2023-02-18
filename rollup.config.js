// import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import ts from 'rollup-plugin-typescript2';
import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url))

const extensions = ['ts']

const resolve = function (filePath) {
    return path.resolve(__dirname, filePath)
}

const tsPlugin = ts({
    tsconfig: resolve('./tsconfig.json'), // 导入本地ts配置
    extensions
})



export default [{
    input: './src/index.ts',
    output: [{
        file: './dist/index.js',
        format: 'umd',
        name:'ZqVueHook',
        sourcemap: true,
        globals:{
            vue:'Vue'
        }
    }, {
        file: './dist/index.min.js',
        plugins: [terser()],
        format: 'umd',
        name:'ZqVueHook',
        globals:{
            vue:'Vue'
        }
    }],
    external: ['vue'],
    plugins: [
        tsPlugin,
        nodeResolve({
            extensions,
        }),
        // resolve(),
        babel({
            exclude: resolve('./node_modules/**') // 只编译我们的源代码
        }),
        // terser()
    ],
}];