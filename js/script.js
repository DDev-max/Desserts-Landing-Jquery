import { createUrl } from "./createUrl.js";
import {StarsSVG} from "./Stars.js"
import {Clock} from "./clock.js"
import { fetchData } from "./fetchData.js";
import { hideSubMenu, showSubMenu, toggleMenu } from "./header/menuFunctions.js";
import { emptyStarColorCode, starColorCode } from "./consts.js";
import { PaginationButtons } from "./paginationButtons.js";


$(async () => {
  const categories = await fetchData({ URL: "http://localhost:3000/categories" });
  const currentCategory = new URLSearchParams(window.location.search).get("category") || 'cookies'
  const $subMenu = $("#subMenu1");



  $(function getCategories() {
    categories.forEach(el => {
      $subMenu.append(
        `<li>
              <a 
                href=${createUrl(
          {
            paramsAndValueObj: { category: el.id },
            hash: 'categories'
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


    $displayMenu.hover(() => { showSubMenu($subMenu, $subMenuName, $displayMenu) }, () => { hideSubMenu($subMenu, $subMenuName, $displayMenu) });


    $(document).keydown((event) => {
      if (event.key === "Escape") {
        hideSubMenu($subMenu, $subMenuName, $displayMenu)
        $subMenuName.attr('aria-expanded', 'false')
      }
    })

    $subMenuName.click(function (event) {
      event.preventDefault()
      toggleMenu($subMenu, $subMenuName, $displayMenu)
      const expanded = $(this).attr('aria-expanded') === 'true' ? 'false' : 'true';
      $subMenuName.attr('aria-expanded', expanded)

    })

  });

  $(function hamburguerMenu() {
    let menuIsVisible = false

    const $openMenu = $(".header_menuSVG")
    const $closedMenu = $(".header_closedMenu")
    const $nav = $("#navMenu")
    const $navShadow = $(".header_navBg")
    const $navBtn = $(".header_menuBtn")

    $navBtn.click(function () {
      menuIsVisible = !menuIsVisible

      const expanded = $(this).attr('aria-expanded') === 'true' ? 'false' : 'true';
      $(this).attr('aria-expanded', expanded);

      $nav.toggleClass("header_nav--visible")
      $navShadow.toggleClass("header_navBg--visible")

      $openMenu.toggle()
      if (menuIsVisible) {
        $closedMenu.css('display', 'block')
      } else {
        $closedMenu.hide()
      }
    })

    $navShadow.click(() => {
      $nav.removeClass("header_nav--visible")
      $navShadow.removeClass("header_navBg--visible")
      menuIsVisible = false
      $closedMenu.hide()
      $openMenu.show()
      $navBtn.attr('aria-expanded', 'false');

    })
  })

  $(function renderCategories() {
    const $categoriesCont = $("#categories")
    categories.forEach(el => {
      $categoriesCont.append(`
        <a
          tabIndex=${currentCategory === el.id ? 0 : -1}
          role='tab'
          aria-selected=${currentCategory === el.id}
          aria-controls='${el.id}Tab'
          id='${el.id}ID'
          class="categoriesSctn_btn ${currentCategory == el.id ? 'categoriesSctn_btn--selected' : ''}"
          href=${createUrl({
        paramsAndValueObj: { category: el.id, page: 1 }
      })}
        >
          <img class="categoriesSctn_btn_img" alt="${el.name} category"  src=${el.imgLink}/>
          <p class="categoriesSctn_btn_title">
            ${el.name}
          </p>
        </a>
        `)
    });

    const allCategories = Array.from($("#categories [role='tab']"))
    let focusedCategory = allCategories.findIndex(el => el.id == `${currentCategory}ID`)


    $categoriesCont.keydown((e) => {
      const totalCategories = allCategories.length

      if (e.key === 'ArrowRight') {
        focusedCategory = (focusedCategory + 1) % totalCategories;
        allCategories[focusedCategory].focus()


      } else if (e.key === 'ArrowLeft') {
        focusedCategory = (focusedCategory - 1 + totalCategories) % totalCategories;
        allCategories[focusedCategory].focus()
      }
    })

  })

  $(async function renderRecipesPg() {
    const $recipeAndCategoriesCont = $(".fullCateogriesCont")
    const curerntPage = new URLSearchParams(window.location.search).get("page") || '1'

    
    const recipes = await fetchData({ URL: `http://localhost:3000/${currentCategory}?_page=${curerntPage}&_per_page=2` })

    recipes.data[recipes.data.length - 1].category.toLowerCase() == currentCategory

    $recipeAndCategoriesCont.append(`
      <div
      tabIndex="0"
      aria-labelledby="${currentCategory}ID"
      id="${currentCategory}Tab"
      class="recipesCont ${recipes.data[0].category.toLowerCase() == currentCategory ? 'recipesCont--rightBrdr': ''}
      ${recipes.data[recipes.data.length - 1].category.toLowerCase() == currentCategory ? 'recipesCont--leftBrdr': ''}"
      >

        ${PaginationButtons({
          currentPage: Number(curerntPage),
          selectedBtnClassName: "recipesCont_btnsCont_btn--selected",
          classNameCont: "recipesCont_btnsCont",
          classNameBtn: "recipesCont_btnsCont_btn",
          buttonsQtty:  recipes.pages
        })}
      </div>`
    )

    
    const $recipesCont = $(".recipesCont")
    recipes.data.forEach(el=>{
      const recipeSteps = el.recipe.match(/[^.]+[.]/g)

      const HtmlSteps = recipeSteps.map(step=>(`
        <li>
          ${step}
        </li>  
      `)).join('')

      $recipesCont.prepend(`
        <article class="recipesCont_recipe" id=${el.id}>
        <img
          class="recipesCont_recipe_img"
          alt=${el.dish}
          src=${el.image}
        />

        <div class="recipesCont_recipe_aditionalInfo">
          ${StarsSVG(el.stars)}
          ${Clock}
          <p>${el.minutesOfPreparation} min</p>
        </div>

        <div class="recipesCont_recipe_info"}>
          <h3>${el.dish}</h3>
          <ol>
            ${HtmlSteps}
          </ol>
        </div>
      </article>
        `)
    })

    const $starsCont = $(".recipesCont_recipe_aditionalInfo");

    $starsCont.on("mouseenter", ".recipesCont_recipe_aditionalInfo_starsCont_star", function (event) {
        const $star = $(event.currentTarget);
        const $container = $star.closest(".recipesCont_recipe_aditionalInfo");
        const $allStars = $container.find(".recipesCont_recipe_aditionalInfo_starsCont_star");
    
        const starIdx = $allStars.index($star);
    
        $allStars.each((index, starElmnt) => {
            const $path = $(starElmnt).find("path").first();
            $path.css({ fill: index <= starIdx ? starColorCode : emptyStarColorCode });
        });
    });
    
    



      
    })

  })






