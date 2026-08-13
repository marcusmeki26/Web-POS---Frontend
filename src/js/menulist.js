import { split } from "postcss/lib/list";
import { categoryService } from "./services/categoryservice";
import { foodService } from './services/foodservice';

// Query Parameter from backend is okay. Now: create the functionality on frontend for filtering by category :REMOVE-COMMENT

async function renderMenuList(container){
  let classes;
  let totalCatCnt = 0;

  const categoriesCount = await getCategoriesCount();
  const foods = await getFoods();

  if(categoriesCount){
    for(const category of categoriesCount)
      totalCatCnt += category.categoryCount;
  }

  // #menu-list-container
  const section = document.createElement("section");
  classes = ["flex", "flex-col", "bg-secondaryBg", "h-full"];
  section.classList.add(...classes);
  section.id = "menu-list-container";

  // First Row
  const divFirstRow = document.createElement("div");
  classes = ["flex-1", "border-b-1", "border-borderColor", "p-3"];
  divFirstRow.classList.add(...classes);

  // First Row Left Side
  const divFRLS = document.createElement("div");
  divFRLS.id = "first-row-left-side";
  classes = ["flex", "gap-2"];
  divFRLS.classList.add(...classes);

  const btnAll = document.createElement("button");
  btnAll.textContent = "All";
  classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
  btnAll.classList.add(...classes);
  btnAll.addEventListener("click", async () => {
    const menuList = await foodService.getMenuList();

    moveActiveBtn(btnAll);

    const url = new URL(window.location.href);
    const newUrl = url.origin + "/landingpage";
    window.history.pushState({}, "", newUrl);

    displayMenuList(menuList);
  });

  const spanAll = document.createElement("span");
  spanAll.textContent = `${totalCatCnt}`;
  classes = ["bg-dividerColor", "pt-[.05rem]", "pb-[.05rem]", "pl-[.25rem]", "pr-[.25rem]", "rounded-xs", "ml-[.5rem]", "font-bold"];
  spanAll.classList.add(...classes);
  btnAll.appendChild(spanAll);

  divFRLS.appendChild(btnAll);

  for(const category of categoriesCount){
    // DOM category here. Use button.
    const btn = document.createElement("button");
    btn.textContent = `${category.categoryType}`;
    classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
    btn.classList.add(...classes);
    btn.id = category.categoryType.toLowerCase().replace(/ /g, "-");

    btn.addEventListener("click", async () => {
      const menuList = await foodService.getMenuListByCategory(category.categoryType);
      
      moveActiveBtn(btn);

      const url = new URL(window.location.href);
      url.searchParams.set("category", category.categoryType);

      window.history.pushState({}, "", url);

      displayMenuList(menuList);
    });

    const span = document.createElement("span");
    span.textContent = `${category.categoryCount}`;
    classes = ["bg-dividerColor", "pt-[.05rem]", "pb-[.05rem]", "pl-[.25rem]", "pr-[.25rem]", "rounded-xs", "ml-[.5rem]", "font-bold"];
    span.classList.add(...classes);
    btn.appendChild(span);

    divFRLS.appendChild(btn); 
  }

  divFirstRow.appendChild(divFRLS);

  // First Row Right Side
  const divFRRS = document.createElement("div");
  divFirstRow.appendChild(divFRRS);

  section.appendChild(divFirstRow);
  container.appendChild(section);

  // Initialize Second Row
  const urlChecker = new URL(window.location.href);
  const searchCatValue = urlChecker.searchParams.get("category");
  if(searchCatValue === null) // If no query parameter
    btnAll.click();
  else{ // If there is a query parameter. Click the correct button
    const searchFormattedValue = searchCatValue.toLowerCase().replace(/ /g, "-");
    console.log(searchFormattedValue);
    const FRLSCntr = document.getElementById("first-row-left-side");
    for(const btnChild of FRLSCntr.children){
      if(searchFormattedValue === btnChild.id){
        const btnRef = document.getElementById(searchFormattedValue);
        if(btnRef)
          btnRef.click();
      }
    }
  }
  
  // UTILITIES
  // Displays Second Row
  function displayMenuList(menuList){ // Current Problem, having multiple DOM creation
    if(section.children.length === 2){
      section.removeChild(section.children[1]);
    }
    if(menuList.length !== 0){
      const divSecondRow = document.createElement("div");
      classes = ["flex-16", "p-3", "flex", "gap-[.5rem]"];
      divSecondRow.classList.add(...classes);

      // First Column
      const divFC = document.createElement("div");
      classes = ["flex-3", "grid", "grid-cols-3", "gap-3", "h-max"];
      divFC.classList.add(...classes);

      menuList.forEach(element => {
        // Initialization
        const inventory = element.inventory;

        const divMenuCntr = document.createElement("div");
        classes = ["flex", "flex-col", "gap-[.5rem]", "relative", "bg-primaryBg", "p-2", "rounded-sm"];
        divMenuCntr.classList.add(...classes);
        
        // Image
        const img = document.createElement("img");
        classes = ["rounded-sm"];
        // Default to sample first
        img.src="/sample_img.jpg";
        img.style.width = "100%";
        img.style.height = "130px";
        img.classList.add(...classes);
        
        // Status 
        const spanStatus = document.createElement("span");
        if(element.withVariant){
          for(const prodVariant of inventory){
            if(prodVariant.quantity > 0){
              displayMenuStatus(spanStatus, prodVariant.quantity)
              break;
            }
          }
        }else{
          displayMenuStatus(spanStatus, inventory[0].quantity);
        }

        // Menu Name & Menu Price
        const divNameNPriceCntr = document.createElement("div");
        classes = ["flex", "justify-between", "text-sm", "font-semibold", "text-primaryColor"];
        divNameNPriceCntr.classList.add(...classes);

        const spanName = document.createElement("span");
        spanName.textContent = element.shortFoodDesc;
        divNameNPriceCntr.appendChild(spanName);
        
        if(!element.withVariant){
          const price = element.price;

          const formattedPrice = new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP"
          }).format(price);

          const spanPrice = document.createElement("span");
          spanPrice.textContent = formattedPrice;  
          divNameNPriceCntr.appendChild(spanPrice);
        }

        console.log(element);
        // Add to cart button
        const btnATC = document.createElement("button"); 
        if(spanStatus.lastChild.textContent.trim() === "Available"){
          if(element.withVariant){
            classes = ["flex", "justify-center", "gap-[.3rem]", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
            btnATC.classList.add(...classes);
    
            // const spanPlusSymbol = document.createElement("span");
            const spanBtnText = document.createElement("span");
            // spanPlusSymbol.textContent = "+";
            spanBtnText.textContent = "Check Variant Prices";
            // btnATC.appendChild(spanPlusSymbol);
            btnATC.appendChild(spanBtnText);
          }else{
            classes = ["flex", "justify-center", "gap-[.3rem]", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
            btnATC.classList.add(...classes);
    
            const spanPlusSymbol = document.createElement("span");
            const spanBtnText = document.createElement("span");
            spanPlusSymbol.textContent = "+";
            spanBtnText.textContent = "Add to Cart";

            btnATC.addEventListener("click", () => {
              // Main Mid Container
              const SCMidCntr = document.getElementById("second-column-mid");
              SCMidCntr.classList.add(...classes);

              // Child Container
              const divMenuDisplay = document.createElement("div");
              classes = ["flex", "border", "max-h-[4.15rem]", "border-borderColor", "p-[.5rem]", "gap-[.3rem]", "text-primaryColor", "font-semibold", "rounded-md"];
              divMenuDisplay.classList.add(...classes);

              // Image
              const imgMD = document.createElement("img"); 
              classes = ["flex-1", "rounded-sm"];
              imgMD.style.width = "20%";
              // imgMD.style.height = "100%";
              imgMD.src = "/sample_img.jpg";
              imgMD.classList.add(...classes);

              // Right Side Container
              const divMDRS = document.createElement("div");
              classes = ["flex", "flex-col", "justify-between", "flex-2", "text-sm"];
              divMDRS.classList.add(...classes);
              
              // Right Side Top Side
              const divMDTS = document.createElement("div");
              classes = ["flex", "flex-col"];
              divMDTS.classList.add(...classes);
              
              // Short Food & Selected Counter container
              const divMDTSFCCntr = document.createElement("div");
              classes = ["flex", "gap-[.3rem]"];
              divMDTSFCCntr.classList.add(...classes);
              // Short Food Description
              const spanFDMDTS = document.createElement("span");
              spanFDMDTS.setAttribute("data-counter", 0);
              classes = ["leading-none"];
              spanFDMDTS.classList.add(...classes);
              spanFDMDTS.textContent = element.shortFoodDesc;
              
              let selectedCtr = spanFDMDTS.getAttribute("data-counter");
              selectedCtr++;
              const spanCMDTS = document.createElement("span");
              classes = ["text-secondaryColor/50", "font-normal", "leading-none"];
              spanCMDTS.classList.add(...classes);
              spanCMDTS.textContent = `(${selectedCtr})`;
              
              divMDTSFCCntr.appendChild(spanFDMDTS);
              divMDTSFCCntr.appendChild(spanCMDTS);

              // Size Display
              const spanSMDTS = document.createElement("span");
              classes = ["text-[.7rem]", "text-secondaryColor", "font-medium", "leading-none", "whitespace-pre"];
              spanSMDTS.classList.add(...classes);
              spanSMDTS.textContent = "\tSize:None"
              
              divMDTS.appendChild(divMDTSFCCntr);
              divMDTS.appendChild(spanSMDTS);
              
              // Bottom Side
              const divMDBS = document.createElement("div");
              classes = ["flex", "justify-between", "items-end"];
              divMDBS.classList.add(...classes);

              // Price
              const spanMDLSBS = document.createElement("span");
              classes = ["leading-none"];
              spanMDLSBS.classList.add(...classes);
              const formattedPrice = new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP"
              }).format(element.price);
              spanMDLSBS.textContent = formattedPrice;
              
              // SVG Container
              const divMDRSBSCntr = document.createElement("div");
              classes = ["flex", "gap-[.3rem]"];
              divMDRSBSCntr.classList.add(...classes);

              // Add edit & delete SVG
              divMDRSBSCntr.innerHTML = 
              `
                <svg width="12" height="12" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25.3342 6.99391C26.6756 5.54064 27.3463 4.81402 28.0589 4.39017C29.7784 3.36747 31.8959 3.33566 33.6443 4.30627C34.3688 4.70854 35.06 5.41471 36.4426 6.82707C37.8251 8.23942 38.5165 8.94559 38.9102 9.68577C39.8604 11.4717 39.8293 13.6347 38.8281 15.3914C38.4132 16.1194 37.7018 16.8045 36.2793 18.1747L19.3526 34.4778C16.6567 37.0745 15.3088 38.3729 13.6241 39.0308C11.9394 39.6888 10.0873 39.6404 6.38321 39.5436L5.87925 39.5304C4.7516 39.5009 4.18777 39.4862 3.86003 39.1141C3.53226 38.7422 3.57701 38.1678 3.66651 37.0193L3.71511 36.3956C3.96698 33.1624 4.09291 31.546 4.72424 30.0929C5.35556 28.6397 6.44456 27.46 8.62254 25.1002L25.3342 6.99391Z" stroke="#161616" stroke-width="2.7" stroke-linejoin="round"/>
                  <path d="M23.3984 7.19995L35.9984 19.8" stroke="#161616" stroke-width="2.7" stroke-linejoin="round"/>
                  <path d="M25.1992 39.6001H39.5992" stroke="#161616" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg width="12" height="12" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35.1016 9.90002L33.9861 27.9452C33.701 32.5555 33.5586 34.8608 32.403 36.5182C31.8315 37.3376 31.096 38.0292 30.2428 38.5488C28.5173 39.6 26.2078 39.6 21.5884 39.6C16.9632 39.6 14.6505 39.6 12.9239 38.5468C12.0702 38.0263 11.3344 37.3335 10.7632 36.5127C9.60795 34.8527 9.46857 32.5442 9.18986 27.9274L8.10156 9.90002" stroke="#161616" stroke-width="2.7" stroke-linecap="round"/>
                  <path d="M5.39844 9.89998H37.7984M28.8987 9.89998L27.67 7.36509C26.8537 5.68124 26.4455 4.83931 25.7415 4.31423C25.5854 4.19776 25.42 4.09415 25.247 4.00444C24.4675 3.59998 23.5318 3.59998 21.6605 3.59998C19.7423 3.59998 18.7832 3.59998 17.9907 4.02139C17.815 4.11479 17.6474 4.2226 17.4896 4.34368C16.7774 4.89004 16.3796 5.76277 15.5839 7.50824L14.4937 9.89998" stroke="#161616" stroke-width="2.7" stroke-linecap="round"/>
                  <path d="M17.1016 29.7V18.9" stroke="#161616" stroke-width="2.7" stroke-linecap="round"/>
                  <path d="M26.1016 29.7V18.9" stroke="#161616" stroke-width="2.7" stroke-linecap="round"/>
                </svg>
              `;
              divMDBS.appendChild(spanMDLSBS);
              divMDBS.appendChild(divMDRSBSCntr);

              divMDRS.appendChild(divMDTS);
              divMDRS.appendChild(divMDBS);

              divMenuDisplay.appendChild(imgMD);
              divMenuDisplay.appendChild(divMDRS);

              SCMidCntr.appendChild(divMenuDisplay);
            });

            btnATC.appendChild(spanPlusSymbol);
            btnATC.appendChild(spanBtnText);
          }
        }else{ 
          classes = ["flex", "justify-center", "gap-[.3rem]", "bg-primaryColor/50", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-not-allowed"];
          btnATC.classList.add(...classes);
          btnATC.disabled = true;

          const spanPlusSymbol = document.createElement("span");
          const spanBtnText = document.createElement("span");
          spanPlusSymbol.textContent = "x";
          spanBtnText.textContent = "Not Available";
          btnATC.appendChild(spanPlusSymbol);
          btnATC.appendChild(spanBtnText);
        }

        divMenuCntr.appendChild(img);
        divMenuCntr.appendChild(spanStatus);
        divMenuCntr.appendChild(divNameNPriceCntr);
        divMenuCntr.appendChild(btnATC);

        divFC.appendChild(divMenuCntr);
      });

      divSecondRow.appendChild(divFC);

      // Second Column
      const divSC = document.createElement("div");
      classes = ["flex-1", "bg-primaryBg", "h-full", "rounded-md"];
      divSC.classList.add(...classes);

      // Second Coulmn Container
      const divSCChild = document.createElement("div");
      classes = ["flex", "justify-between", "text-sm", "text-primaryColor", "font-bold", "p-[.5rem]", "border-b", "border-borderColor"];
      divSCChild.classList.add(...classes);

      // Top Side
      const divSCChildTop = document.createElement("div");
      const spanLSTopSide = document.createElement("span");
      spanLSTopSide.textContent = "Order Summary";
      
      const spanRSTopSide = document.createElement("span");
      spanRSTopSide.textContent = "#R000001";

      divSCChild.appendChild(spanLSTopSide);
      divSCChild.appendChild(spanRSTopSide);
      divSC.appendChild(divSCChild);

      // Middle Side
      const divSCChildMid = document.createElement("div");
      classes = ["flex", "flex-col", "gap-[.5rem]", "p-[.5rem]"];
      divSCChildMid.classList.add(...classes);
      divSCChildMid.id = "second-column-mid";

      divSC.appendChild(divSCChildMid);

      // Bottom Side
      const divSCChildBottom = document.createElement("div");

      divSecondRow.appendChild(divSC);

      section.appendChild(divSecondRow);
      container.appendChild(section);
    }
  }

  function displayMenuStatus(span, quantity){
    classes = ["flex", "gap-[.3rem]", "items-center", "absolute", "top-[1rem]", "right-[.9rem]", "z-[2]", "bg-primaryBg", "text-primaryColor", "text-xs", "font-medium", "p-1", "rounded-sm"];
    span.classList.add(...classes)

    const spanDot = document.createElement("span");
    const spanStatusText = document.createElement("span");
    if(quantity > 0){
      classes = ["size-[.35rem]", "bg-sucessConfirm", "rounded-[50%]"];
      spanDot.classList.add(...classes);
      spanStatusText.textContent = " Available";
      span.appendChild(spanDot);
      span.appendChild(spanStatusText);
      return;
    }

    classes = ["size-[.35rem]", "bg-errorAlert", "rounded-[50%]"];
    spanDot.classList.add(...classes);
    spanStatusText.textContent = " Not Available";
    span.appendChild(spanDot);
    span.appendChild(spanStatusText);
    return;
  }

  function moveActiveBtn(btnRef){
    if(section.children){
      const divParent = section.firstChild;
      const divChild = divParent.firstChild;

      for(const btn of divChild.children)
        btn.classList.remove("active");

      btnRef.classList.add("active");
    }
  }
}

// Category Initialization 
const getCategoriesCount = async () => {
  try{
    const categoriesCount = await categoryService.getCategoriesCount(); 
    return categoriesCount;
  }catch(error){
    if(error.response){
      console.log("Server error fetching category: ", error.response.status, error.response.data)
    }else{
      console.error('Network error fetching food:', error.message);
    }
  }
};

// Food Initialization
const getFoods = async () => {
  try{
    const foods = await foodService.getMenuList();
    return foods;
  }catch(error){
    if(error.response){
      console.log("Server error fetching category: ", error.response.status, error.response.data)
    }else{
      console.error('Network error fetching food:', error.message);
    }
  }
}

/*
  WHAT IT SHOULD LOOK LIKE
  - TWO SECTION OF ROW

  - ONE THE FIRST ROW
    - How to display the UI:
      - If the quantity is = 0 mark the menu as not available
      - If the menu has no product variant display the price
      - If the menu has product variant, there is a pop-up that will show the prices per variant. To access a button will appear like `Check Price`
  
  - ON THE SECOND ROW TWO SECTION OF COLUMN
    - Left side are the menus & right side are the checkout, viewing of selected menu, and total

  PROCESS (COULD CHANGE)
  - During choosing of menu, it should be placed or added on the table list. Receipt should not print. Printing of receipt is only done by going to `table list`
*/

export { renderMenuList };