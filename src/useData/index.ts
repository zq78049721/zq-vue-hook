import useAsyncRun from '../useAsyncRun/index'
import { ErrorHandler } from '../useAsyncRun/types'
import { ISort, IUseDataParams, IRequestParams } from './types'
import { ref, Ref } from 'vue'

function selectWithoutEmpty(value1: any, value2: any) {
    if (value1 === undefined || value1 === null) {
        return value2
    } else {
        return value1
    }
}

export default function useData<T>(params: IUseDataParams<T>, errorHandler: ErrorHandler) {
    const { loading, layzRun } = useAsyncRun<any,void>(errorHandler)
    const isPager = params.pager
    const pager = ref(params.pager || { page: 1, pageSize: -1 })
    const sorts = ref(params.sorts || [])
    const items: Ref<T[]> = ref([])
    const total = ref(0)


    const getReqeustPagerParams = (props: IRequestParams) => {
        if (isPager) {
            return {
                page: selectWithoutEmpty(props.page, pager.value.page),
                pageSize: selectWithoutEmpty(props.pageSize, pager.value.pageSize)
            }
        } else {
            return
        }
    }

    const request = async (props: IRequestParams) => {
        const _pager = getReqeustPagerParams(props)
        const _sorts = selectWithoutEmpty(props.sorts, sorts.value)
        const rst = await params.getData(_pager, _sorts)
        if (_pager) {
            if (pager.value.page !== _pager.page) {
                pager.value.page = _pager.page
            }
            if (pager.value.pageSize !== _pager.pageSize) {
                pager.value.pageSize = _pager.pageSize
            }
        }
        if (sorts.value !== _sorts) {
            sorts.value = _sorts
        }
        total.value = rst.total
        items.value = rst.items
    }

    const onSearch=(page:number=1)=>{
        return request({
            page
        })
    }

    const onPageChange=(page:number)=>{
        if(!isPager){
            throw new Error('未开启分页查询功能!')
        }
        return request({
            page
        })
    }

    const onPageSizeChange=(pageSize:number)=>{
        if(!isPager){
            throw new Error('未开启分页查询功能!')
        }
        return request({
            pageSize,
            page:1
        })
    }

    const onOrder=(sorts:ISort[])=>{
        return request({
            sorts
        })
    }


    return {
        loading,
        items,
        total,
        pager,
        sorts,
        onSearch:layzRun(onSearch,"onSearch") as (page?:number)=>Promise<void>,
        onPageChange:layzRun(onPageChange,"onPageChange") as (page:number)=>Promise<void>,
        onPageSizeChange:layzRun(onPageSizeChange,"onPageSizeChange") as (pageSize:number)=>Promise<void>,
        onOrder:layzRun(onOrder,"onOrder") as (sorts:ISort[])=>Promise<void>
    }
}