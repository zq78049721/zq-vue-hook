* #### layzRun

```html

  <div id="run">
    <div><span>5*5=</span>{{ loading ? '...' : result }}</div>
    <button @click="onClick()">开始运算</button>
  </div>

```

```javascript

import { ref } from 'vue'
import { useAsyncRun } from 'zq-vue-hook'

const sleep = (delay) => {
  return new Promise(reslove => {
    setTimeout(reslove, delay)
  })
}

async function request(params) {
  await sleep(2000);
  const value = params ? params.value : 0
  return value * value
}
export default {
  setup() {
    const result = ref('?')
    const { loading, layzRun } = useAsyncRun(() => { })
    const warpRun = layzRun(request, 'calculating')
    const onClick = async () => {
      result.value = await warpRun({ value: 5 })
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
<example2/>
</output>