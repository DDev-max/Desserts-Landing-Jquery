export function createUrl({ paramsAndValueObj, router, hash }) {
    const params = new URLSearchParams(window.location.search)
    const pathName  = window.location.pathname
  
    Object.entries(paramsAndValueObj).forEach(([param, value]) => {
      params.set(param, value.toString())
    })
  
    // if (router) {
    //   router.push(`${pathName}?${params.toString()}`, { scroll: false })
    // }
  
    if (hash) {
      return `${pathName}?${params.toString()}#${hash}`
    }
  
    return `${pathName}?${params.toString()}`
  }