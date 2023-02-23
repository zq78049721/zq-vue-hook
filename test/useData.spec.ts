import useData from '../src/useData/index'
import { test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { sleep } from './testUtils'
import { IGetDataParams, IPager, ISort } from '../src/useData/types'


const items = [...new Array(96)].map((value, index) => {
    return index + 1;
})

const getData = async (range: number[], pager: IPager, sorts?: ISort[]) => {
    await sleep(100)
    const [min, max] = range
    const start = (pager.page - 1) * pager.pageSize;
    const end = pager.page * pager.pageSize
    const totalItems = items.filter(item => item >= min && item <= max);
    const total = totalItems.length;
    const result = totalItems.filter((value, index) => {
        return start <= index && index < end
    })

    return {
        items: result,
        total
    }
}

const defaultSorts = [{
    name: 'sortColumn1',
    order: 'asc'
}]

const updatedSorts = [{
    name: 'sortColumn2',
    order: 'desc'
}]

test('useData', async () => {
    function handler(error: any, step?: string) {
        //...
    }

    let asyncWarp: any = null;
    mount({
        setup() {
            const query = [10, 60]
            const {
                loading,
                items,
                total,
                page,
                pageSize,
                sorts,
                pageCount,
                isFirstPage,
                isLastPage,
                wait,
                onPre,
                onNext,
                onSkipPage,
                onFirst,
                onLast,
                onSearch
            } = useData<number>({
                page: 1,
                pageSize: 5,
                sorts: defaultSorts,
                getData: (params?: IGetDataParams) => {
                    expect(loading.value).toBe(true);
                    if (!params?.pager) {
                        throw new Error('没有分页参数!')
                    }
                    return getData(query, params.pager, params.sorts)
                }
            }, handler)

            asyncWarp = async function () {
                expect(sorts.value).toEqual(defaultSorts);
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([]);
                expect(total.value).toBe(0);
                expect(page.value).toBe(1);
                expect(pageSize.value).toBe(5);
                onSearch()
                await wait();

                expect(loading.value).toBe(false);
                expect(items.value).toEqual([10, 11, 12, 13, 14]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(1);
                expect(pageSize.value).toBe(5);
                expect(pageCount.value).toBe(11);
                expect(isFirstPage.value).toBe(true);
                expect(isLastPage.value).toBe(false);


                page.value=3
                await wait()
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([20, 21, 22, 23, 24]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(3);
                expect(pageSize.value).toBe(5);
                expect(isFirstPage.value).toBe(false);
                expect(isLastPage.value).toBe(false);

                page.value=11
                await wait()
                expect(items.value).toEqual([60]);
                expect(isFirstPage.value).toBe(false);
                expect(isLastPage.value).toBe(true);

                page.value=5
                pageSize.value=10
                await wait()
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([50,51,52,53,54,55,56,57,58,59]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(5);
                expect(pageSize.value).toBe(10);
                expect(pageCount.value).toBe(6);

                onPre()
                await wait()
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([40,41,42,43,44,45,46,47,48,49]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(4);
                expect(pageSize.value).toBe(10);
                expect(pageCount.value).toBe(6);

                onNext()
                await wait()
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([50,51,52,53,54,55,56,57,58,59]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(5);
                expect(pageSize.value).toBe(10);
                expect(pageCount.value).toBe(6);

                onSkipPage(3)
                await wait()
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([30,31,32,33,34,35,36,37,38,39]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(3);
                expect(pageSize.value).toBe(10);
                expect(pageCount.value).toBe(6);

                onFirst()
                await wait()
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([10,11,12,13,14,15,16,17,18,19]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(1);
                expect(pageSize.value).toBe(10);
                expect(pageCount.value).toBe(6);
                expect(isFirstPage.value).toBe(true);
                expect(isLastPage.value).toBe(false);

                onLast()
                await wait()
                expect(loading.value).toBe(false);
                expect(items.value).toEqual([60]);
                expect(total.value).toBe(51);
                expect(page.value).toBe(6);
                expect(pageSize.value).toBe(10);
                expect(pageCount.value).toBe(6);
                expect(isFirstPage.value).toBe(false);
                expect(isLastPage.value).toBe(true);


                sorts.value=updatedSorts
                await wait()
                expect(sorts.value).toEqual(updatedSorts);
            }

            return () => { }
        }
    }, {})
    await asyncWarp()
});