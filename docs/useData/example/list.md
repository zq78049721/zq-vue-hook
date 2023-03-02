* #### list

```html

  <div v-if="loading">查询中...
  </div>
  <ul v-if="!loading">
    <li v-for="item in items">{{ item }}</li>
    <div>
      <span class="mr15">当前页面:{{ `${page}/${pageCount}` }}</span>
      <span class="mr15">每页行数:{{ pageSize }}</span>
      <span>总查询数据量:{{ total }}</span>
    </div>
    <div>
      <button class="mr15" @click="onFirst" :disabled="isFirstPage">第一页</button>
      <button class="mr15" @click="onPre" :disabled="isFirstPage">上一页</button>
      <button class="mr15" @click="onSkipPage(3)">跳转到第三页</button>
      <button class="mr15" @click="onNext" :disabled="isLastPage">下一页</button>
      <button class="mr15" @click="onLast" :disabled="isLastPage">最一页</button>

      <button class="mr15" @click="pageSize = 10" :disabled="isLastPage" v-if="pageSize === 5">切换为每页显示10行</button>
      <button class="mr15" @click="pageSize = 5" :disabled="isLastPage" v-if="pageSize === 10">切换为每页显示5行</button>

      <button @click="changeSort">反转</button>
    </div>
  </ul>

```

```javascript

import { computed } from 'vue'
import { useData } from 'zq-vue-hook'
export default {
  setup() {
    const sleep = (delay) => {
      return new Promise(reslove => {
        setTimeout(reslove, delay)
      })
    }

    const allItems = [...new Array(96)].map((value, index) => {
      return index + 1;
    })

    const handler = (error, step) => {
      //...
    }

    const request = async (range, pager, sorts) => {
      await sleep(2000)
      const [min, max] = range
      const order = sorts && sorts.length ? sorts[0].order : 'asc'
      const start = (pager.page - 1) * pager.pageSize;
      const end = pager.page * pager.pageSize
      const totalItems = allItems.filter(item => item >= min && item <= max);
      if (order === 'desc') {
        totalItems.reverse()
      }
      const total = totalItems.length;
      const result = totalItems.filter((value, index) => {
        return start <= index && index < end
      })
      return {
        items: result,
        total
      }
    }


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
      onPre,
      onNext,
      onSkipPage,
      onFirst,
      onLast,
      onSearch
    } = useData({
      page: 1,
      pageSize: 5,
      sorts: [],
      getData: async ({ pager, sorts }) => {
        if (!pager) {
          throw new Error('没有分页参数!')
        }
        return await request([10, 50], pager, sorts)
      }
    }, handler)
    onSearch()

    const currentOrder = computed(() => {
      if (!sorts.value || !sorts.value.length) {
        return 'asc'
      }
      return sorts.value[0].order
    })

    const changeSort = () => {
      const order = currentOrder.value === 'asc' ? 'desc' : 'asc'
      sorts.value = [{
        name: 'number',
        order
      }]
    }

    return {
      loading,
      items,
      total,
      page,
      sorts,
      pageSize,
      pageCount,
      isFirstPage,
      isLastPage,
      onPre,
      onNext,
      onSkipPage,
      onFirst,
      onLast,
      changeSort
    }
  }
}

```

<output data-lang="output">
<example5/>
</output>