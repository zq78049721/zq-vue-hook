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
      }, handler, {
        mode: 'call'
      })

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


        page.value = 3
        await sleep(2000)
        expect(items.value).toEqual([10, 11, 12, 13, 14]);
        expect(total.value).toBe(51);
        expect(page.value).toBe(3);
        expect(pageSize.value).toBe(5);
        expect(pageCount.value).toBe(11);
        expect(isFirstPage.value).toBe(false);
        expect(isLastPage.value).toBe(false);

        onSearch()
        await wait()
        expect(loading.value).toBe(false);
        expect(items.value).toEqual([20, 21, 22, 23, 24]);
        expect(total.value).toBe(51);
        expect(page.value).toBe(3);
        expect(pageSize.value).toBe(5);
        expect(isFirstPage.value).toBe(false);
        expect(isLastPage.value).toBe(false);
      }

      return () => { }
    }
  }, {})
  await asyncWarp()
});