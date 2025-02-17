import {createUrl} from "./functions/createUrl.js"
import {hideSubMenu,showSubMenu,toggleMenu} from "./functions/menuFunctions.js"
import {Clock} from "./svg/Clock.js"
import {LinkSVG} from "./svg/LinkSVG.js"
import {StarsSVG} from "./svg/Stars.js"
import {PaginationButtons} from "./PaginationButtons.js"
import {baseUrl,categoriesUrl,emptyStarColorCode,faqUrl,sponsorsUrl,starColorCode} from "./consts.js"
import { generateJsonLd } from "./functions/generateJsonLd.js"

$(async () => {

  const currentCategory = new URLSearchParams(window.location.search).get("category") || 'cookies'
  const $subMenu = $("#subMenu1");


  $.getJSON(categoriesUrl, function (categories) {

    $(function getCategories() {
      categories.reverse().forEach(el => {
        $subMenu.append(
          `<li>
            <a 
              href=${createUrl({ paramsAndValueObj: { category: el.id }, hash: 'categories' })}
            >
              ${el.name}
            </a>
          </li>`
        );
      });

    });

    $(function renderCategories() {
      const $categoriesCont = $("#categories")
      categories.forEach(el => {
        $categoriesCont.prepend(`
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

  }).fail(function (xhr, status, error) {
    console.error('Error: ' + error);
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

  $(async function renderRecipesPg() {
    const $categoriesSctn = $(".categoriesSctn")
    const curerntPage = new URLSearchParams(window.location.search).get("page") || '1'

    $.getJSON(`${baseUrl}/${currentCategory}?_page=${curerntPage}&_per_page=2`, function (recipes) {

      $("head").append(`
        
        <script type="application/ld+json">
          ${ generateJsonLd({from: recipes, type: "recipeList"})}
        </script>
      `)

      $categoriesSctn.after(`
        <div
        tabIndex="0"
        aria-labelledby="${currentCategory}ID"
        id="${currentCategory}Tab"
        class="recipesCont ${recipes.data[0].category.toLowerCase() == currentCategory ? 'recipesCont--rightBrdr' : ''}
        ${recipes.data[recipes.data.length - 1].category.toLowerCase() == currentCategory ? 'recipesCont--leftBrdr' : ''}"
        >
  
          ${PaginationButtons({
        currentPage: Number(curerntPage),
        buttonsQtty: recipes.pages,
        selectedBtnClassName: "recipesCont_btnsCont_btn--selected",
        classNameCont: "recipesCont_btnsCont",
        classNameBtn: "recipesCont_btnsCont_btn",
      })}
        </div>`
      )


      const $recipesCont = $(".recipesCont")
      recipes.data.forEach(el => {
        const recipeSteps = el.recipe.match(/[^.]+[.]/g)

        const HtmlSteps = recipeSteps.map(step => (`
          <li>
            ${step}
          </li>  
        `)).join('')

        $recipesCont.prepend(`
          <article class="recipesCont_recipe" id=${el.id}>
          <img
            class="recipesCont_recipe_img"
            alt="${el.dish}"]
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





    }).fail(function (xhr, status, error) {
      console.error('Error: ' + error);
    });





  })


  $(async function renderSponsor() {

    $.getJSON(sponsorsUrl, function (sponsorRecipes) {

      sponsorRecipes.forEach((elmnt) => {
        $(".section_grid").append(`
        <a rel='sponsored' href=${elmnt.url} class="section_grid_elmnt">
            <img class="section_grid_elmnt_img" src=${elmnt.image} alt="${elmnt.dish}" />

            <div class="section_grid_elmnt_recipeCont">
              <h3 class="section_grid_elmnt_recipeCont_title">
                  ${elmnt.dish}

                ${LinkSVG({ className: "section_grid_elmnt_recipeCont_title_linkSVG" })}
              </h3>
            </div>
          </a>
          `)
      })
    }).fail(function (xhr, status, error) {
      console.error('Error: ' + error);
    });



  })


  $(async function renderFaq() {

    $.getJSON(faqUrl, function (faqData) {

      $("head").append(`
        
        <script type="application/ld+json">
          ${ generateJsonLd({from: faqData, type: "faq"})}
        </script>
      `)

      faqData.forEach((elmt) => {
        $(".faqSctn_questionCont").append(`
          <details class="faqSctn_questionCont_details" name='question'>
              <summary class="faqSctn_questionCont_summ">
                ${elmt.question}
              </summary>
              <p class="faqSctn_questionCont_p"> 
                ${elmt.answer}
              </p>
          </details>
          `)

      })
    }).fail(function (xhr, status, error) {
      console.error('Error: ' + error);
    });



  })

})