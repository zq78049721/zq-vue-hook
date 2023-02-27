> 该函数接受一个异步方法，返回 loading、run、layzRun 3个属性，其中run和layzRun可以接受一个异步函数进行执行，执行过程中会根据实际情况切换loading.value属性，如果在执行过程中报错则会运行errorHandler函数

### 参数说明

``errorHandler:(error:any,step?:string)=>void``出错时候会调用该方法
  * ``error:any``:错误描述对象
  * ``step:string``:错误的步骤(自定义)

### 返回对象

1. `loading:Computed<boolean>`只读,当`run`或者`layzRun`方法被运行时，`loading.value===true` 否则 `loading.value===false`

2. ``run:func:((params?:T)=> Promise<M>,step?: string, params?: T)=>Promise<M | undefined>))``执行`func`参数传入的函数,如果执行过程中出现错误则调用构造参数传入的`errorHandler`函数
    * ``func:(params?:T)=> Promise<M>``需要被执行的函数
    * ``step?:string``为被执行的函数取一个自定义的步骤名称
    * ``params?:T``执行func函数所需要传入的参数

3. ``layzRun:(func:(params?: T) => Promise<M>, step?: string)): (params?: T) => Promise<M | undefined>``与run函数类似,区别是layzRun会返回一个对`func`参数包装后的函数,在有需要的时候才进行调用.
    * ``func:(params?:T)=> Promise<M>``需要被执行的函数
    * ``step?:string``为被执行的函数取一个自定义的步骤名称

### 示例