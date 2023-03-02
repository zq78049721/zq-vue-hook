import { computed, unref } from 'vue'

export default function (params: any) {
    const classNames = computed(() => {
        return Object.keys(params).filter(key => {
            const method = params[key]
            return typeof method === 'function' ? method() : unref(method)
        }).map(key => key)
    })

    return classNames
}