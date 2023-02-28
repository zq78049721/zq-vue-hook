import useClasses from '../src/useClasses/index'
import { test, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

test('useAsyncRun', async () => {
    let asyncWarp: any = null;
    mount({
        setup() {
            const n2 = ref(2)
            const n3 = ref(true)
            const classNames = useClasses({
                sum18() { return 9 * 2 === 18 },
                sum20() { return 10 * 1 === 20 },
                n10: true,
                even: () => n2.value * 3 % 2 === 0,
                n3
            })
            asyncWarp = async function () {
                expect(classNames.value).toEqual(['sum18', 'n10', 'even', 'n3']);
                n2.value = 3
                expect(classNames.value).toEqual(['sum18', 'n10', 'n3']);
                n3.value = false
                expect(classNames.value).toEqual(['sum18', 'n10']);
            }

            return () => { }
        }
    }, {})
    await asyncWarp()
});