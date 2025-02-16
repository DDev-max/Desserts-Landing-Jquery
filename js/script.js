import { createUrl } from "./createUrl.js";
import { fetchData } from "./fetchData.js";
import { hideSubMenu, showSubMenu, toggleMenu } from "./header/menuFunctions.js";


$(async () => {
  const categories = await fetchData({ URL: "http://localhost:3000/categories" });
  const $subMenu = $("#subMenu1");


  $(function getCategories() {
    categories.forEach(el => {
      $subMenu.append(
        `<li>
              <a 
                href=${createUrl(
          {
            paramsAndValueObj: { category: el.name },
            hash: 'categories',
            pathName: window.location.pathname,
            searchParams: window.location.search
          })}
              >
                   
                ${el.name}

              </a>
          </li>`
      )
    });

  });


  $(function displayMenu() {
    const $displayMenu = $("#displayMenu");
    const $subMenuName = $("#categoriesMenu")


    $displayMenu.hover(()=>{showSubMenu($subMenu, $subMenuName, $displayMenu)}, ()=>{hideSubMenu($subMenu, $subMenuName, $displayMenu)});


    $(document).keydown((event) => {
      if (event.key === "Escape") {
        hideSubMenu($subMenu, $subMenuName, $displayMenu)
      }
    })

    $subMenuName.click((event)=>{
      event.preventDefault()
      toggleMenu($subMenu, $subMenuName, $displayMenu)
    })

  });

  $(function hamburguerMenu() {
    let menuIsVisible = false

    const $openMenu = $(".header_menuSVG")
    const $closedMenu = $(".header_closedMenu")
    const $nav =  $("#navMenu")
    const $navShadow = $(".header_navBg")

    $(".header_menuBtn").click(()=>{
      menuIsVisible = !menuIsVisible  
      $nav.toggleClass("header_nav--visible")
      $navShadow.toggleClass("header_navBg--visible")

      $openMenu.toggle()
      if (menuIsVisible) {
        $closedMenu.css('display', 'block')
      }else{
        $closedMenu.hide()
      }
    })

    $navShadow.click(()=>{
      $nav.removeClass("header_nav--visible")
      $navShadow.removeClass("header_navBg--visible")
    })
  })


})


