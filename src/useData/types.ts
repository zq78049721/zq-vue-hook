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
    pager?:IPager,
    sorts?:ISort[],
    getData:IGetData<T>
}

export type IGetData<T>=(pager?: IPager, sorts?: ISort[]) => Promise<IListResult<T>>

export interface IRequestParams{
    pageSize?:number,
    page?:number,
    sorts?:ISort[]
}