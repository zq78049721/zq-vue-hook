export interface IPager {
    pageSize: number,
    page: number,
}

export interface ISort {
    name: string,
    order: String
}

export interface IListResult<T>{
    total:number,
    items:T[]
}

export interface IUseDataParams<T>{
    pageSize?:number,
    page?:number,
    sorts?:ISort[],
    getData:IGetData<T>
}

export interface IGetDataParams{
    pager?:IPager,
    sorts?:ISort[]
}

export type IGetData<T>=(params?:IGetDataParams) => Promise<IListResult<T>>

export interface IRequestParams{
    pageSize?:number,
    page?:number,
    sorts?:ISort[]
}

export interface IOptions{
    mode?:string,
    supportPager?:boolean
}