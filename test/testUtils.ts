export function sleep(wait:number=500){
    return new Promise(reslove=>{
        setTimeout(reslove, wait);
    })
}