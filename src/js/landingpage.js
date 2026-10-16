import { updateTime } from './pos/datefunction.js';
import { authService, getRole } from './services/authservice.js';
import { removeParams } from './utilities.js';

// We can make use of sweetalert2 :REMOVE-COMMENT
// Add store setup on owner page :REMOVE-COMMENT

const basePath = import.meta.env.VITE_ROOT_PROJECT_PATH;
let classes;

// Think of a way on how to solve this since during href or reload in-memory value of access_token is erased :REMOVE-COMMENT
await authService.refresh(); 
const roles = getRole();

populateNavItem();

// Entry point
const currTab = sessionStorage.getItem("active-tab");
navigate(currTab);

initNavOnClick();

updateTime();
setInterval(updateTime, 1000);

// Landing page utilities
const userCollapsibleInfo = document.getElementById("user-collapsible");
userCollapsibleInfo.addEventListener("click", () => {
  // Temp logout functionality
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "http://localhost:5173";
});
//

async function navigate(page){
  const app = document.getElementById("app");
  if(app)
    app.innerHTML = "";

  const navLinks = document.getElementById("navigation-list");
  if(navLinks){
    // Removes .active class on li
    for(const child of navLinks.children){
      if(child.children.length > 1){
        if(child.lastElementChild.children.length > 0){
          for(const liChild of child.lastElementChild.lastElementChild.children)
            liChild.classList.remove("active");
        }
      }else{
        child.classList.remove("active");
      }
    }
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
    if(page === "dashboard" || page === null || page === ""){
      import('./admin/dashboard.js')
      .then(({ renderDashboard }) => {
        removeParams();
        const liDashboardRef = document.getElementById("dashboard");
        liDashboardRef.classList.add("active");

        renderDashboard(app);
      })
      .catch((err) => {
        console.error("Failed to load module:", err);
      });
    }else if(page === "report"){
      import('./admin/report.js')
      .then(({ renderReport }) => {
        removeParams();
        const liReportRef = document.getElementById("report");
        liReportRef.classList.add("active");

        renderReport(app);
      })
      .catch((err) => {
        console.error("Failed to load module:", err);
      });
    }else if(page === "food"){
      import('./admin/menu/food.js')
      .then(({ renderFood }) => {
        removeParams();
        const liFoodRef = document.getElementById("food");
        liFoodRef.classList.add("active");

        renderFood(app);
      })
      .catch((err) => {
        console.error("Failed to load module:", err);
      });
    }else if(page === "category"){
      import('./admin/menu/category.js')
        .then(({ renderCategory }) => {
          removeParams();
          const liCategoryRef = document.getElementById("category");
          liCategoryRef.classList.add("active");

          renderCategory(app);
        })
    }else if(page === "variant"){
      import('./admin/menu/variant.js')
      .then(({ renderVariant }) => {
        removeParams();
        const liInventoryRef = document.getElementById("variant");
        liInventoryRef.classList.add("active");

        renderVariant(app);
      })
      .catch((err) => {
        console.error("Failed to load module:", err);
      });
    }else if(page === "inventory"){
      import('./admin/inventory.js')
      .then(({ renderInventory }) => {
        removeParams();
        const liInventoryRef = document.getElementById("inventory");
        liInventoryRef.classList.add("active");

        renderInventory(app);
      })
      .catch((err) => {
        console.error("Failed to load module:", err);
      });
    }else if(page === "user"){
      import('./admin/user.js')
      .then(({ renderUser }) => {
        removeParams();
        const liUserRef = document.getElementById("user");
        liUserRef.classList.add("active");

        renderUser(app);
      })
      .catch((err) => {
        console.error("Failed to load module:", err);
      });
    }
  }
}

function initNavOnClick(){
  const navLists = document.getElementById("navigation-list");
  if(navLists){
    for(const child of navLists.children){
      if(!child.lastElementChild.classList.contains("collapsible-content")){
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

      const divIconText = document.createElement("div");
      classes = ["flex", "w-full", "gap-[.5rem]", "items-center"];
      divIconText.classList.add(...classes);
      divIconText.innerHTML = navItemSvg[index];
  
      const span = document.createElement("span");
      classes = ["font-medium", "text-primaryColor"];
      span.classList.add(...classes);
      span.textContent = item;
      const liId = (item).toLowerCase().replace(" ", "-");
      li.id = liId;
      divIconText.appendChild(span);
      // li.appendChild(span);

      li.appendChild(divIconText);
  
      ulCntr.appendChild(li);
    });
  }else if(roles.includes("OWNER")){
    // Navigation list rendering
    const ulCntr = document.getElementById("navigation-list");
    const navItemSvg = [
      `<svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.8008 12.1499C37.8008 8.42198 34.7788 5.3999 31.0508 5.3999C27.3228 5.3999 24.3008 8.42198 24.3008 12.1499C24.3008 15.8778 27.3228 18.8999 31.0508 18.8999C34.7788 18.8999 37.8008 15.8778 37.8008 12.1499Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M18.8984 12.1499C18.8984 8.42198 15.8764 5.3999 12.1484 5.3999C8.42051 5.3999 5.39844 8.42198 5.39844 12.1499C5.39844 15.8778 8.42051 18.8999 12.1484 18.8999C15.8764 18.8999 18.8984 15.8778 18.8984 12.1499Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M37.8008 31.05C37.8008 27.3221 34.7788 24.3 31.0508 24.3C27.3228 24.3 24.3008 27.3221 24.3008 31.05C24.3008 34.778 27.3228 37.8 31.0508 37.8C34.7788 37.8 37.8008 34.778 37.8008 31.05Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M18.8984 31.05C18.8984 27.3221 15.8764 24.3 12.1484 24.3C8.42051 24.3 5.39844 27.3221 5.39844 31.05C5.39844 34.778 8.42051 37.8 12.1484 37.8C15.8764 37.8 18.8984 34.778 18.8984 31.05Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`,
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17L7 13" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 17L12 7" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M17 17L17 11" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`,
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 18V10C20 8.11438 20 7.17157 19.4142 6.58579C18.8284 6 17.8856 6 16 6H4V18C4 19.8856 4 20.8284 4.58579 21.4142C5.17157 22 6.11438 22 8 22H16C17.8856 22 18.8284 22 19.4142 21.4142C20 20.8284 20 19.8856 20 18Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 11C13.6569 11 15 12.3431 15 14M12 11C10.3431 11 9 12.3431 9 14M12 11V10M15 14H9M15 14H16M9 14H8" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 18H16" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 6L11.3846 2.90586C13.0337 2.21492 13.8582 1.86945 14.5149 2.04543C14.9408 2.15954 15.3173 2.41193 15.5859 2.76336C16 3.30532 16 4.20355 16 6" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 18V10C20 8.11438 20 7.17157 19.4142 6.58579C18.8284 6 17.8856 6 16 6H4V18C4 19.8856 4 20.8284 4.58579 21.4142C5.17157 22 6.11438 22 8 22H16C17.8856 22 18.8284 22 19.4142 21.4142C20 20.8284 20 19.8856 20 18Z" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 11C13.6569 11 15 12.3431 15 14M12 11C10.3431 11 9 12.3431 9 14M12 11V10M15 14H9M15 14H16M9 14H8" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 18H16" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 6L11.3846 2.90586C13.0337 2.21492 13.8582 1.86945 14.5149 2.04543C14.9408 2.15954 15.3173 2.41193 15.5859 2.76336C16 3.30532 16 4.20355 16 6" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.1977 8H10.8023C7.35836 8 5.03641 11.5806 6.39304 14.7994C6.58202 15.2477 7.0156 15.5385 7.49535 15.5385H8.33892C8.62326 15.5385 8.87111 15.7352 8.94007 16.0157L10.0261 20.4328C10.2525 21.3539 11.0663 22 12 22C12.9337 22 13.7475 21.3539 13.9739 20.4328L15.0599 16.0157C15.1289 15.7352 15.3767 15.5385 15.6611 15.5385H16.5047C16.9844 15.5385 17.418 15.2477 17.607 14.7994C18.9636 11.5806 16.6416 8 13.1977 8Z" stroke="#3A6EA5" stroke-width="1.5"/>
        <circle cx="12" cy="5" r="3" stroke="#3A6EA5" stroke-width="1.5"/>
      </svg>`
    ];
    const navItems = ["Dashboard", "Report", "Menu", "Inventory", "User"];
    // Makes the navigation item collapsible. Adds an arrow beside the text
    // 0 = No
    // 1 = Yes
    const navItemCollapsible = [0, 0, 1, 0 ,0];
    // If the navItemCollapsible is 0 leave it as empty array. Else fill values
    const navItemCollapsibleContent = [
      [],
      [],
      ["Food", "Category", "Variant"],
      [],
      []
    ];
    navItems.forEach((item, index) => {
      const li = document.createElement("li");
      classes = ["flex", "flex-col", "justify-between", "p-[.5rem]", "text-xs", "cursor-pointer"];
      li.classList.add(...classes);
  
      // li.innerHTML = navItemSvg[index];
      const divIconText = document.createElement("div");
      classes = ["flex", "w-full", "gap-[.5rem]", "items-center"];
      divIconText.classList.add(...classes);
      divIconText.innerHTML = navItemSvg[index];
  
      const span = document.createElement("span");
      classes = ["font-medium", "text-primaryColor"];
      span.classList.add(...classes);
      span.textContent = item;
      const liId = (item).toLowerCase().replace(" ", "-");
      li.id = liId;
      divIconText.appendChild(span);
      // li.appendChild(span);

      li.appendChild(divIconText);

      if(navItemCollapsible[index] == 1){
        divIconText.innerHTML += `
          <svg class="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="#3A6EA5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        
        const divCollapsibleMenu = document.createElement("div");
        classes = ["collapsible-content", "pl-[.8rem]"];
        divCollapsibleMenu.classList.add(...classes);
        divIconText.addEventListener("click", () => {
          if(divCollapsibleMenu.classList.contains("active")){
            divCollapsibleMenu.classList.remove("active");
            if(divIconText.lastElementChild instanceof SVGElement){
              const path = divIconText.lastElementChild.querySelectorAll("path");
              path[0].setAttribute("d", "M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9");
            }
          }else{
            divCollapsibleMenu.innerHTML = ""; // Reset inner HTML
            divCollapsibleMenu.classList.add("active"); 
            if(divIconText.lastElementChild instanceof SVGElement){
              const path = divIconText.lastElementChild.querySelectorAll("path");
              path[0].setAttribute("d", "M6 15L12 9L18 15"); 
            }

            const ulMenuCntr = document.createElement("ul");
            classes = ["flex", "flex-col", "gap-[.5rem]", "pt-[.5rem]"];
            ulMenuCntr.classList.add(...classes);

            navItemCollapsibleContent[index].forEach(menu => {
              const liMenuTxtCntr = document.createElement("li");
              classes = ["p-[.3rem]"];
              liMenuTxtCntr.classList.add(...classes);
              const spanCollabsible = document.createElement("span");
              classes = ["font-medium", "text-primaryColor"];
              spanCollabsible.classList.add(...classes);
              spanCollabsible.textContent = menu;
              liMenuTxtCntr.appendChild(spanCollabsible); 

              const pageText = menu.trim().toLowerCase();
              const pageRoute = pageText.replace(" ", "-"); 
              liMenuTxtCntr.addEventListener("click", () => navigate(pageRoute));
              const liMenuTxtCntrId = menu.toLowerCase().replace(" ", "-");
              liMenuTxtCntr.id = liMenuTxtCntrId;

              ulMenuCntr.appendChild(liMenuTxtCntr);
            });
            divCollapsibleMenu.appendChild(ulMenuCntr);
          }
        });

        li.appendChild(divCollapsibleMenu);
      }
      
      ulCntr.appendChild(li);
    });
  }
}