> 该函数接受一个异步方法，实现一个基本的数据查询功能(分页、排序)

### 参数说明

``params:IUseDataParams<T>``
  * ``pageSize?:number``:一次查询多少数据
  * ``page?:number``:查询第几页的数据
  * ``sorts?:ISort[]``:排序规则
      * ``name``:需要排序的数据名称
      * ``order``:升序还是降序
  * ``getData?:IGetData``:获取数据的方法
       ```js
        export interface IPager {
          pageSize: number,
          page: number,
        }

        export interface ISort {
          name: string,
          order: String
        }

        export interface IListResult<T>{
          total:number, //查询总记录数
          items:T[] //查询到的数据集
        }

        export interface IGetDataParams{
          pager?:IPager, //分页规则
          sorts?:ISort[] //排序规则
        }

        export type IGetData<T>=(params?:IGetDataParams) => Promise<IListResult<T>>
       ```
``errorHandler:(error:any,step?:string)=>void``查询出错时候会调用该方法

``options?: IOptions``
  * ``mode?: string,``查询模式 'default' 默认模式,'call' 手动模式，需要调用onSearch才可以触发查询,默认值 'default'
  * ``supportPager?: boolean``是否进行分页查询 默认值 true

### 返回对象

  ``loading:Computed<boolean>``在查询数据的时候loading.value=true 否则loading.value=false

  ``pageSize:Ref<number>``当前页面信息,默认值30

  ``page:Ref<number>``当前第几页

  ``sorts:Ref<ISort[]>``当前的排序规则

  ``items:Computed<T[]>``当前页面的数据

  ``total:Computed<number>``总共的数据量

  ``pageCount,:Computed<number>``总共有多少页

  ``isFirstPage:Computed<boolean>``是否为第一页 (page.value===1)

  ``isLastPage:Computed<boolean>``是否为最后一页

  ``onPre:()=>void``切换到前一页

  ``onNext:()=>void``切换到下一页

  ``onSkipPage:(page:number)=>void``切换到指定页数

  ``onFirst:()=>void``切换到第一页

  ``onLast:()=>void``也换到最后一页

  ``onSearch():Promise<void>``如果有必要的情况下，调用该方法可以手动执行一次数据查询

!> useData 初始化后的第一次查询需要手动调用一次``onSearch``方法

### 示例