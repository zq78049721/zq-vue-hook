import useData from '../src/useData/index'
import { test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { sleep } from './testUtils'
import { IPager, ISort } from '../src/useData/types'


const items=[...new Array(96)].map((value,index)=>{
    return index+1;
})

const getData=async (range:number[],pager:IPager,sorts?:ISort[])=>{
    await sleep(100)
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

const defaultSorts=[{
    name:'sortColumn1',
    order:'asc'
 }]

 const updatedSorts=[{
    name:'sortColumn2',
    order:'desc'
 }]

test('useData', async () => {
    function handler(error: any, step?: string) {
        //...
    }

    let asyncWarp:any=null;
    mount({
        setup() {
            const query=[10,30]
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
                    return getData(query,pager,sorts)
                 }
             },handler)

            asyncWarp = async function () {

                expect(sorts.value).toEqual(defaultSorts);
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([]);
                expect(total.value).toBe(0);
                expect(pager.value.page).toBe(1);
                expect(pager.value.pageSize).toBe(5);
                let wait =onSearch()
                expect(loading.value).toBe(true);
                await wait
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([10,11,12,13,14]);
                expect(total.value).toBe(21);
                expect(pager.value.page).toBe(1);
                expect(pager.value.pageSize).toBe(5);


                wait =onPageChange(3)
                expect(loading.value).toBe(true);
                await wait
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([20,21,22,23,24]);
                expect(total.value).toBe(21);
                expect(pager.value.page).toBe(3);
                expect(pager.value.pageSize).toBe(5);


                wait =onPageChange(5)
                await wait
                expect(items.value).toEqual([30]);

                wait =onPageSizeChange(10)
                expect(pager.value.page).toBe(5);
                expect(pager.value.pageSize).toBe(5);
                await wait
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([10,11,12,13,14,15,16,17,18,19]);
                expect(total.value).toBe(21);
                expect(pager.value.page).toBe(1);
                expect(pager.value.pageSize).toBe(10);

                await onOrder(updatedSorts)
                expect(sorts.value).toEqual(updatedSorts);
            }

            return () => { }
        }
    }, {})
    await asyncWarp()
});