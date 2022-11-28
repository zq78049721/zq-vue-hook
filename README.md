# zq-vue-hook
一些vue3通用的组合式函数

### useAsyncRun

该函数接受一个异步方法，返回 loading、run、layzRun 3个属性，其中run和layzRun可以接受一个异步函数进行执行，执行过程中会根据实际情况切换loading.value属性，如果在执行过程中报错则会运行errorHandler函数

#### 入参说明

|  参数名 | 类型  | 说明  |
|  ----  | ---- | ----  |
| errorHandler  | ErrorHandler=(error:any,step?:string)=>void | 当执行异步函数出错时候会调用该函数，error 是错误对象，step 用来备注说明，如果有的话则会传入 |

#### 出参说明

|  参数名 | 类型  | 说明  |
|  ----  | ---- | ----  |
| loading  | Ref<boolean> | loading.value=true 则表示正在运行异步函数,false则表示没有运行函数
| run  | func: (params?: T) => Promise<M>, step?: string, params?: T |执行func参数传入的函数,step为步骤标记当出错的时候会传递给errorHandler,params 为func 函数的入参 | 
| layzRun  | func: (params?: T) => Promise<M>, step?: string | 与run函数功能类似，区别是layzRun是对func参数的包装,会返回一个函数，在需要的时候调用执行 |

#### 代码示例
``` typescript
    interface IRequestParams {
        value: number,
        throwError?: boolean
    }

    interface IResponse {
        square: number
    }

    const errorMessage = 'request is error'
    function handler(error: any, step?: string) {
        console.log(error.message) //request is error
        console.log(step) // step3
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
    
    // 延迟运行
    const layzRequest = layzRun(request);
    const layzValue = await layzRequest({ value: 3 })
    cosole.log(layzValue.square) // 9
    
    // 错误处理
    const errorWait = run(request, 'step3', { value: 2, throwError: true })
    await errorWait //错误输出查看 handler 方法
```


