<template>
  <div id="run">
    <div><span>3*3=</span>{{ loading ? '...' : result }}</div>
    <button @click="onClick()">开始运算</button>
  </div>
</template>

<script>
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
        throw new Error(errorMessage)
      }
      const value = params ? params.value : 0
      return value * value
    }

    // const { ref } = Vue
    const result = ref('?')
    // const { useAsyncRun } = ZqVueHook
    const { loading, run } = useAsyncRun(() => { })
    const onClick = async () => {
      result.value = await run(request, 'calculating', { value: 3 })
    }
    return {
      loading,
      result,
      onClick
    }
  }
}
</script>