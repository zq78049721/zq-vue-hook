import { ErrorHandler } from './types'
import { ref } from 'vue'

export default function useAsyncRun<T, M>(errorHandler: ErrorHandler) {
    const loading = ref(false)

    async function run(func: (params?: T) => Promise<M>, step?: string, params?: T) {
        try {
            loading.value = true;
            const result = await func(params)
            return result
        } catch (error: any) {
            errorHandler(error, step)
        } finally {
            loading.value = false
        }
    }

    function layzRun(func: (params?: T) => Promise<M>, step?: string){
        return function(params?:T){
            return run(func,step,params)
        }
    }

    return {
        loading,
        layzRun,
        run
    }
}