import { createUrl } from "./createUrl.js"

export function PaginationButtons( {buttonsQtty, classNameBtn, classNameCont, currentPage, selectedBtnClassName}){
    const emptyArray = Array.from({ length: buttonsQtty }, (_, idx) => idx + 1)
    
    const btns =  emptyArray.map((elmnt, idx)=>(`
         <a
          class="${classNameBtn} ${currentPage == elmnt ? selectedBtnClassName : ''}"
          aria-current=${currentPage === elmnt}
          title=${`Go to page ${elmnt}`}
          aria-label=${`Go to page ${elmnt}`}
          href=${createUrl({ paramsAndValueObj: { page: idx + 1 }})}
        >
          ${elmnt}
        </a>

    `)).join('')

    return `
     <div class=${classNameCont}>
        ${btns}
    </div>
    `
}