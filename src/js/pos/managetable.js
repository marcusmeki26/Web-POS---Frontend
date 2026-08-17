console.log("manage-table")

function renderManageTable(container){
  const span = document.createElement("span");

  span.textContent = "Test Manage Table";

  container.appendChild(span);
}

export { renderManageTable }; 