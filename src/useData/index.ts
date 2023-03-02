import useAsyncRun from '../useAsyncRun/index'
import { ErrorHandler } from '../useAsyncRun/types'
import { IUseDataParams, IOptions } from './types'
import { ref, Ref, computed, watch } from 'vue'

function defaultOptions() {
    return {
        mode: 'default',
        supportPager: true,
    }
}


export default function useData<T>(params: IUseDataParams<T>, errorHandler: ErrorHandler, options?: IOptions) {
    const { loading, layzRun } = useAsyncRun<any, void>(errorHandler)
    const _options = {
        ...defaultOptions(),
        ...options
    }

    const pageSize = ref(params.pageSize || 30)
    const page = ref(params.page || 1)
    const sorts = ref(params.sorts || [])
    const _items: Ref<T[]> = ref([])
    const _total = ref(0)
    const pageCount = computed(() => {
        let count: number = _total.value / pageSize.value;
        if (_total.value % pageSize.value != 0) {
            count++
        }
        return parseInt(count + "")
    })
    const isFirstPage = computed(() => page.value === 1)
    const isLastPage = computed(() => page.value === pageCount.value)

    const onFirst = () => {
        if (!isFirstPage.value) {
            page.value = 1
        }
    }

    const onLast = () => {
        if (!isLastPage.value) {
            page.value = pageCount.value
        }
    }

    const onNext = () => {
        !isLastPage.value && page.value++
    }

    const onPre = () => {
        !isFirstPage.value && page.value--
    }

    const onSkipPage = (newPage: number) => {
        if (1 < newPage && pageCount.value > newPage) {
            page.value = newPage
        }
    }

    const pager = computed(() => {
        if (!_options.supportPager) { return }
        return {
            page: page.value,
            pageSize: pageSize.value
        }
    })

    const items = computed(() => _items.value)
    const total = computed(() => _total.value)

    let promise: Promise<void> | null = null
    let reslove: any = null

    const wait = () => {
        if (!promise) {
            promise = new Promise(r => {
                reslove = r
            })
        }
        return promise;
    }

    const done = () => {
        if (promise) {
            promise = null
            reslove()
            reslove = null
        }
    }

    if (options?.mode !== 'call') {
        watch([pageSize, page, sorts], async () => {
            onSearch()
        })
    }

    const _search = async () => {
        const rst = await params.getData({ pager: pager.value, sorts: sorts.value })
        _items.value = rst?.items || []
        _total.value = rst?.total || 0
    }

    const layzSearch = layzRun(_search, 'onSearch')

    const onSearch = async () => {
        await layzSearch()
        done()
    }

    return {
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
    }
}