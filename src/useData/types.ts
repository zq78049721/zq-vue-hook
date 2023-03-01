export interface IPager {
    pageSize: number,
    page: number,
}

export interface ISort {
    name: string,
    order: String
}

export interface IListResult<T> {
    total: number,
    items: T[]
}

export interface IUseDataParams<T> {
    pageSize?: number,
    page?: number,
    sorts?: ISort[],
    getData: IGetData<T>
}

export interface IGetDataParams {
    pager?: IPager,
    sorts?: ISort[]
}

export type IGetData<T> = (params?: IGetDataParams) => Promise<IListResult<T>>

export interface IRequestParams {
    pageSize?: number,
    page?: number,
    sorts?: ISort[]
}
/**
 *选项
 *
 * @export mode 查询模式 'default' 默认模式,'call' 手动模式，需要调用onSearch才可以触发查询,默认值 'default'
 * @export supportPager 是否进行分页查询 默认值 true
 * @interface IOptions
 */
export interface IOptions {
    mode?: string,
    supportPager?: boolean
}