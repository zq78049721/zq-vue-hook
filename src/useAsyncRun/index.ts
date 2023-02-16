import { ErrorHandler } from './types'
import { ref,computed } from 'vue'

export default function useAsyncRun<T, M>(errorHandler: ErrorHandler) {
    const _loading = ref(false)

    const loading=computed(()=>_loading.value)

    async function run(func: (params?: T) => Promise<M>, step?: string, params?: T) {
        try {
            _loading.value = true;
            const result = await func(params)
            return result
        } catch (error: any) {
            errorHandler(error, step)
        } finally {
            _loading.value = false
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