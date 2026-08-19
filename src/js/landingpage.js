import { updateTime } from './pos/datefunction.js';

const basePath = import.meta.env.VITE_ROOT_PROJECT_PATH;

// Entry point
const currTab = sessionStorage.getItem("active-tab");
if(currTab === "menu")
  navigate("menu-list");
else if (currTab === "table")
  navigate("manage-table");

initNavOnClick();

updateTime();
setInterval(updateTime, 1000);

function navigate(page){
  const app = document.getElementById("app");
  if(app)
    app.innerHTML = "";

  const navLinks = document.getElementById("navigation-list");
  if(navLinks){
    // Removes .active class on li
    for(const child of navLinks.children)
      child.classList.remove("active");
  }
  
  if(page === "menu-list"){
    import('./pos/menulist.js')
    .then(({ renderMenuList }) => {
      // Code here
      const menuList = document.getElementById("menu-list");
      menuList.classList.add("active");

      renderMenuList(app);
    })
    .catch((err) => {
      console.error("Failed to load module:", err);
    });
  }else if(page === "manage-table"){
    import('./pos/managetable.js')
    .then(({ renderManageTable }) => {
      // Code here
      const manageTable = document.getElementById("manage-table");
      manageTable.classList.add("active");

      renderManageTable(app);
    })
    .catch((err) => {
      console.error("Failed to load module:", err);
    });
  }
}

function initNavOnClick(){
  const navLists = document.getElementById("navigation-list");
  if(navLists){
    for(const child of navLists.children){
      const span = child.querySelector("span");
      
      if (span) {
        // Get the text, remove extra whitespace, and make it lowercase
        const pageText = span.textContent.trim().toLowerCase();
  
        // Example mapping: "menu" -> "menu", "manage table" -> "manage-table"
        const pageRoute = pageText.replace(" ", "-"); 
  
        child.addEventListener("click", () => navigate(pageRoute));
      }
    }
  }
}