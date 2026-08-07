console.log("menu-list");

function renderMenuList(container){
  const span = document.createElement("span");

  span.textContent = "Test menu list";

  container.appendChild(span);
}

export { renderMenuList };