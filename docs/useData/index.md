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
          return request([10,50],pager,sorts)
      }
  },handler)
  
  await onSearch()
  await onPageChange(3)
  await onPageSizeChange(10)
  await onOrder([{name:'...',order:'desc'}])
  }

```