## 安装

```bash
npm install zq-vue-hook
```
-------------------
## useAsyncRun


> 该函数接受一个异步方法，返回 loading、run、layzRun 3个属性，其中run和layzRun可以接受一个异步函数进行执行，执行过程中会根据实际情况切换loading.value属性，如果在执行过程中报错则会运行errorHandler函数

### 参数说明
|  参数名 | 类型  | 说明  |
|  ----  | ---- | ----  |
| errorHandler  | ErrorHandler=(error:any,step?:string)=>void | 当执行异步函数出错时候会调用该函数，error 是错误对象，step 用来备注说明，如果有的话则会传入 |

### 返回对象

|  参数名 | 类型  | 说明  |
|  ----  | ---- | ----  |
| loading  | Ref<boolean> | loading.value=true 则表示正在运行异步函数,false则表示没有运行函数
| run  | func: (params?: T) => Promise<M>, step?: string, params?: T |执行func参数传入的函数,step为步骤标记当出错的时候会传递给errorHandler,params 为func 函数的入参 | 
| layzRun  | func: (params?: T) => Promise<M>, step?: string | 与run函数功能类似，区别是layzRun是对func参数的包装,会返回一个函数，在需要的时候调用执行 |

### 示例


```javascript

    interface IRequestParams {
        value: number,
        throwError?: boolean
    }

    interface IResponse {
        square: number
    }

    const errorMessage = 'request is error'
    function handler(error: any, step?: string) {
        console.log(error.message) // request is error
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
    // 错误输出查看 handler 方法
    await errorWait 
```

-------------------

## useData

> 该函数接受一个异步方法，实现一个基本的数据查询功能(分页、排序)

### 参数说明

``params:IUseDataParams<T>``

```js
interface IUseDataParams<T>{
    pager?:IPager,   // {pageSize:number,page:number},当前分页的信息
    sorts?:ISort[],  // [{name:string,order:string},...] 当前排序的信息,order值为('asc' or 'desc')
    getData:(pager?: IPager, sorts?: ISort[]) => Promise<IListResult<T>> // IListResult:{total:number,items:T[]} 获取数据的方法
```

``errorHandler:(error:any,step?:string)=>void``出错时候会调用该方法

### 返回对象

  ``loading:Ref<boolean>``在查询数据的时候loading.value=true 否则loading.value=false

  ``items:Ref<T[]>``当前页面的数据

  ``total:Ref<number>``总共的数据量

  ``pager:Ref<IPager>``当前页面信息

  ``sorts:Ref<ISort[]>``当前的排序规则

  ``onSearch(page:number):Promise<void>``调用该方法进行分页、排序查询

  ``onPageChange(page:number):Promise<void>``切换页面数据

  ``onPageSizeChange(pageSize:number):Promise<void>``切换当前页面可显示的数据量，并且重新查询当前页面的数据
  
  ``onOrder(sorts:ISort[]):Promise<void>``对数据进行排序，并且重新查询当前页面

### 示例

```javascript
  async function main(){
      const items=[...new Array(96)].map((value,index)=>{
          return index+1;
      })

      async function request(range:number[],pager:IPager,sorts?:ISort[])=>{
          const [min,max]=range
          const start=(pager.page-1)*pager.pageSize;
          const end=pager.page*pager.pageSize
          const totalItems=items.filter(item=>item>=min && item<=max);
          const total=totalItems.length;
          const result= totalItems.filter((value,index)=>{
              return start<=index && index <end 
          })

          return {
              items:result,
              total
          }
      }
      
      function handler(error: any, step?: string) {
          //...
      }

    const { 
      loading,
      items,
      total,
      pager,
      sorts,
      onSearch,
      onPageChange,
      onPageSizeChange,
      onOrder
    } = useData<number>({
      pager:{
          page:1,
          pageSize:5
      },
      sorts:defaultSorts,
      getData:(pager?:IPager,sorts?:ISort[])=>{
          if(!pager){
              throw new Error('没有分页参数!')
          }
          return request(query,pager,sorts)
      }
  },handler)
  
  await onSearch()
  await onPageChange(3)
  await onPageSizeChange(10)
  await onOrder([{name:'...',order:'desc'}])
  }

```