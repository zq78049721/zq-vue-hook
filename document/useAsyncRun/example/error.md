* #### error

```html

  <div id="run">
    <div><span>9*9=</span>{{ loading ? '...' : result }}</div>
    <button @click="onClick()">开始运算</button>
  </div>

```

```javascript

import { ref } from 'vue'
import { useAsyncRun } from 'zq-vue-hook'
export default {
  setup() {
    const sleep = (delay) => {
      return new Promise(reslove => {
        setTimeout(reslove, delay)
      })
    }
    const request = async (params) => {
      await sleep(2000);
      if (params && params.throwError) {
        throw new Error('运行的时候出错!')
      }
      const value = params ? params.value : 0
      return value * value
    }

    // const { ref } = Vue
    const result = ref('?')
    // const { useAsyncRun } = ZqVueHook
    const { loading, run } = useAsyncRun((error) => { alert(error.message) })
    const onClick = async () => {
      result.value = await run(request, 'calculating', { value: 9, throwError: true })
    }
    return {
      loading,
      result,
      onClick
    }
  }
}

```

<output data-lang="output">
<example1/>
</output>