import { updateTime } from './pos/datefunction.js';
import { authService, getRole } from './services/authservice.js';

// We can make use of sweetalert2 :REMOVE-COMMENT

const basePath = import.meta.env.VITE_ROOT_PROJECT_PATH;
let classes;

await authService.refresh();
const roles = getRole();

populateNavItem();

// Entry point
const currTab = sessionStorage.getItem("active-tab");
if(currTab === "menu")
  navigate("menu-list");
else if (currTab === "table")
  navigate("manage-table");
else
  navigate("");

initNavOnClick();

updateTime();
setInterval(updateTime, 1000);

async function navigate(page){
  const app = document.getElementById("app");
  if(app)
    app.innerHTML = "";

  const navLinks = document.getElementById("navigation-list");
  if(navLinks){
    // Removes .active class on li
    for(const child of navLinks.children)
      child.classList.remove("active");
  }

  if(roles.includes("CASHIER", "MANAGER")){
    if(page === "menu-list" || page === null || page === ""){
      import('./pos/menulist.js')
      .then(({ renderMenuList }) => {
        removeParams();
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
        removeParams();
        const manageTable = document.getElementById("manage-table");
        manageTable.classList.add("active");
  
        renderManageTable(app);
      })
      .catch((err) => {
        console.error("Failed to load module:", err);
      });
    }
  }else if(roles.includes("OWNER")){
    // Navigation list rendering
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

function removeParams(){
  const url = new URL(window.location.href);
  const newUrl = url.origin + "/landingpage";
  window.history.replaceState({}, "", newUrl);
}

function populateNavItem(){
  if(roles.includes("CASHIER", "MANAGER")){
    // Navigation list rendering
    const ulCntr = document.getElementById("navigation-list");
    const navItemSvg = [
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 18V10C20 8.11438 20 7.17157 19.4142 6.58579C18.8284 6 17.8856 6 16 6H4V18C4 19.8856 4 20.8284 4.58579 21.4142C5.17157 22 6.11438 22 8 22H16C17.8856 22 18.8284 22 19.4142 21.4142C20 20.8284 20 19.8856 20 18Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 11C13.6569 11 15 12.3431 15 14M12 11C10.3431 11 9 12.3431 9 14M12 11V10M15 14H9M15 14H16M9 14H8" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 18H16" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 6L11.3846 2.90586C13.0337 2.21492 13.8582 1.86945 14.5149 2.04543C14.9408 2.15954 15.3173 2.41193 15.5859 2.76336C16 3.30532 16 4.20355 16 6" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 17C4.5 17 4.5 16 3 16L4.17111 11.9011C4.57006 10.5048 4.76954 9.80661 5.30421 9.4033C5.83888 9 6.56499 9 8.01721 9H15.9828C17.435 9 18.1611 9 18.6958 9.4033C19.2305 9.80661 19.4299 10.5048 19.8289 11.9011L21 16C19.5 16 19.5 17 18 17C16.5 17 16.5 16 15 16C13.5 16 13.5 17 12 17C10.5 17 10.5 16 9 16C7.5 16 7.5 17 6 17Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 9V8C8 5.79086 9.79086 4 12 4M16 9V8C16 5.79086 14.2091 4 12 4M12 4V3" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 17V21M12 21H14M12 21H10" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    ];
    const navItems = ["Menu List", "Manage Table"];
    navItems.forEach((item, index) => {
      const li = document.createElement("li");
      classes = ["flex", "gap-[.5rem]", "items-center", "p-[.5rem]", "text-xs", "cursor-pointer"];
      li.classList.add(...classes);
  
      li.innerHTML = navItemSvg[index];
  
      const span = document.createElement("span");
      classes = ["font-medium", "text-primaryColor"];
      span.classList.add(...classes);
      span.textContent = item;
      const liId = (item).toLowerCase().replace(" ", "-");
      li.id = liId;
      console.log(liId);
      li.appendChild(span);
  
      ulCntr.appendChild(li);
    });
  }
}