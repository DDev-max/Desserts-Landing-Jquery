export function showSubMenu($subMenu, $subMenuName, $displayMenu) {
  $subMenu.addClass("header_nav_menu_item_subMenu--visible");
  $subMenuName.text("Types ▲");
  $displayMenu.addClass("header_nav_menu_item--extended");
  $subMenuName.attr('aria-expanded', 'true')
}

export function hideSubMenu($subMenu, $subMenuName, $displayMenu) {
  $subMenu.removeClass("header_nav_menu_item_subMenu--visible");
  $displayMenu.removeClass("header_nav_menu_item--extended");
  $subMenuName.text("Types ▼");
  $subMenuName.attr('aria-expanded', 'false')
}

export function toggleMenu($subMenu, $subMenuName, $displayMenu) {
  $subMenu.toggleClass("header_nav_menu_item_subMenu--visible");
  $displayMenu.toggleClass("header_nav_menu_item--extended");
  const expanded = $(this).attr('aria-expanded') === 'true' ? 'false' : 'true';
  $subMenuName.attr('aria-expanded', expanded)
}
