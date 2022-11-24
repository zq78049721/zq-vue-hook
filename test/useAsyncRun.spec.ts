import useAsyncRun from '../src/useAsyncRun/index'
import { test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { sleep } from './testUtils'

interface IRequestParams {
    value: number,
    throwError?: boolean
}

interface IResponse {
    square: number
}

test('useAsyncRun', async () => {
    const errorMessage = 'request is error'
    function handler(error: any, step?: string) {
        expect(error.message).toEqual(errorMessage)
        expect(step).toBe('step3')
    }

    async function request(params?: IRequestParams): Promise<IResponse> {
        await sleep();
        if (params && params.throwError) {
            throw new Error(errorMessage)
        }
        const value = params ? params.value : 0
        return {
            square: value * value
        }
    }
    let asyncWarp:any=null
    mount({
        setup() {
            const { loading, run, layzRun } = useAsyncRun<IRequestParams, IResponse>(handler)
            asyncWarp = async function () {
                expect(loading.value).toBe(false);
                const wait = run(request, undefined, { value: 2 })
                expect(loading.value).toBe(true);
                const value = await wait
                expect(loading.value).toBe(false);
                expect(value?.square).toBe(4)

                const layzRequest = layzRun(request);
                const layzWait = layzRequest({ value: 3 })
                expect(loading.value).toBe(true);
                const layzValue = await layzWait
                expect(loading.value).toBe(false);
                expect(layzValue?.square).toBe(9)

                const errorWait = run(request, 'step3', { value: 2, throwError: true })
                expect(loading.value).toBe(true);
                await errorWait
                expect(loading.value).toBe(false);
            }

            return () => { }
        }
    }, {})
    await asyncWarp()
});