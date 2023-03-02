* #### classNames

```html

  classNames is {{ classNames }}
  <br />
  <br />
  <input v-model="val" />

```

```javascript

import { ref } from "vue";
import { useClasses } from "zq-vue-hook";
export default {
  setup() {
    const val = ref(0);
    const classNames = useClasses({
      isInit: () => /^[0-9]*$/.test(val.value + ""),
      is20: () => 20,
      isEven: () => val.value % 2 === 0,
    });
    return {
      classNames,
      val,
    };
  },
};

```

<output data-lang="output">
<example4/>
</output>