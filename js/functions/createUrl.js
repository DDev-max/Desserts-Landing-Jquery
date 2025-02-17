export function createUrl({ paramsAndValueObj, hash }) {
    const params = new URLSearchParams(window.location.search)
    const pathName  = window.location.pathname
  
    Object.entries(paramsAndValueObj).forEach(([param, value]) => {
      params.set(param, value.toString())
    })
  
  
    if (hash) {
      return `${pathName}?${params.toString()}#${hash}`
    }
  
    return `${pathName}?${params.toString()}`
  }