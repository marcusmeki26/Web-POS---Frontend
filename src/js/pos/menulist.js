import { categoryService } from "../services/categoryservice";
import { foodService } from '../services/foodservice';
import { orderService } from "../services/orderservice";
import { taxService } from "../services/taxservice";
import { tableListService } from "../services/tablelistservice";
import { orderTypeService } from "../services/ordertypeservice";

// Proceed to Payment is the last process where it will send the whole transaction to the backend. There will be a popup of how much
//  +the customer paid :REMOVE-COMMENT 

async function renderMenuList(container){
  const formatAmount = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  });
  sessionStorage.setItem("active-tab", "menu");

  // Set tax percentage on local storage
  const taxPercentage = await taxService.getActiveTax();
  if(taxPercentage){
    localStorage.setItem("tax-percent", taxPercentage.taxPercentage);
    localStorage.setItem("tax-description", taxPercentage.taxDescription);
  }

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
  classes = ["flex", "flex-col", "bg-secondaryBg", "h-full", "min-h-0"];
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
  async function displayMenuList(menuList){
    let receiptNo = "";

    if(section.children.length === 2){
      section.removeChild(section.children[1]);
    }
    if(menuList.length !== 0){
      const divSecondRow = document.createElement("div");
      classes = ["flex-16", "p-3", "flex", "gap-[.5rem]", "min-h-0"];
      divSecondRow.classList.add(...classes);

      // First Column
      const divFC = document.createElement("div");
      classes = ["flex-3", "grid", "grid-cols-3", "gap-3", "h-max"];
      divFC.classList.add(...classes);

      menuList.forEach(element => {
        let discountAmt = 0; // No functionality yet :REMOVE-COMMENT 

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
          const spanPrice = document.createElement("span");
          spanPrice.textContent = formatAmount.format(price);  
          divNameNPriceCntr.appendChild(spanPrice);
        }

        // Add to cart button
        const btnATC = document.createElement("button");
        if(spanStatus.lastChild.textContent.trim() === "Available"){
          if(element.withVariant){ // WITH VARIANT          
            classes = ["flex", "justify-center", "gap-[.3rem]", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
            btnATC.classList.add(...classes);
    
            const spanBtnText = document.createElement("span");
            spanBtnText.textContent = "Check Variant Prices";
            spanBtnText.addEventListener("click", async () => {

              const body = document.getElementById("body");

              const divModalVariant = document.createElement("div");
              classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryColor", "z-[3]"];
              divModalVariant.classList.add(...classes);

              const divModalCntrChild = document.createElement("div");
              classes = ["flex", "gap-[.6rem]", "flex-col", "bg-primaryBg", "p-3", "rounded-md"];
              divModalCntrChild.classList.add(...classes);

              const spanX = document.createElement("span");
              classes = ["self-end", "text-errorAlert", "cursor-pointer"];
              spanX.classList.add(...classes);
              spanX.textContent = "X";
              divModalCntrChild.appendChild(spanX);

              spanX.addEventListener("click", () => {
                body.removeChild(divModalVariant);
              });

              const spanCaption = document.createElement("span");
              classes = ["font-bold", "text-[1.2rem]"];
              spanCaption.classList.add(...classes);
              spanCaption.textContent = `${element.foodName} available variants`;
              divModalCntrChild.appendChild(spanCaption);

              element.inventory.forEach(async (prodVariant) => {
                // Create a variable for each data/record needed. Use it for also passing into API :REMOVE-COMMENT
                const sizeId = prodVariant.productVariant.size.id;
                const sizeName = prodVariant.productVariant.size.sizeName;
                const sizePrice = prodVariant.productVariant.price;
                const sizeQty = prodVariant.productVariant.quantity;

                const divVariantPriceCntr = document.createElement("div");
                classes = ["flex", "justify-evenly"];
                divVariantPriceCntr.classList.add(...classes);
                const spanProdVariant = document.createElement("span");
                spanProdVariant.textContent = sizeName;
                const spanProdVariantPrice = document.createElement("span");
                spanProdVariantPrice.textContent = formatAmount.format(sizePrice);

                // Check if existing on item line
                const order = await orderService.getOrderByNumber(element.id);

                let isExisting = false;   
                let currQty = 0;
                for(const item of order){
                  if(item.number === element.id && item.sizeId === sizeId){
                    isExisting = true;
                    currQty = item.quantity;
                    break;
                  }
                }
                
                const btnATCVariant = document.createElement("button");
                classes = ["flex", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "p-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
                btnATCVariant.classList.add(...classes);
                btnATCVariant.id = `${sizeId}-ATC-VARIANT`;
                if(!isExisting){
                  btnATCVariant.textContent = "Add to Cart";
  
                  btnATCVariant.addEventListener("click", async () => {
                    // Main Mid Container
                    const SCMidCntr = document.getElementById("second-column-mid");
                    // SCMidCntr.classList.add(...classes);
      
                    // Child Container
                    const divMenuDisplay = document.createElement("div");
                    classes = ["flex", "border", "max-h-[4.15rem]", "border-borderColor", "p-[.5rem]", "gap-[.3rem]", "text-primaryColor", "font-semibold", "rounded-md"];
                    divMenuDisplay.classList.add(...classes);
                    divMenuDisplay.id = `${element.number}-MD`;
      
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
                    spanCMDTS.id = `${sizeId}-MDQTY`;
                    spanCMDTS.textContent = `(${selectedCtr})`;
                    
                    divMDTSFCCntr.appendChild(spanFDMDTS);
                    divMDTSFCCntr.appendChild(spanCMDTS);
      
                    // Size Display
                    const spanSMDTS = document.createElement("span");
                    classes = ["text-[.7rem]", "text-secondaryColor", "font-medium", "leading-none", "whitespace-pre"];
                    spanSMDTS.classList.add(...classes);
                    spanSMDTS.textContent = `\tSize:${sizeName}`;
                    
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
                    spanMDLSBS.id = `${sizeId}-MDPRICE`;
                    spanMDLSBS.textContent = element.amount;
                    
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
  
                    const orderData = {
                      receiptNo: receiptNo,
                      number: element.id,
                      shortFoodDesc: element.shortFoodDesc,
                      price: sizePrice,
                      sizeId: sizeId,
                      size: sizeName,
                      discountPercent: 0,
                      discountAmount: discountAmt,
                      entryType: "ORDER",
                      quantity: selectedCtr,
                      placed: false,
                      tableId: null
                    }
  
                    const response = await orderService.postOrder(orderData);
                    if(response.status != 201) // Resets the DOM of mid container
                      SCMidCntr.innerHTML = ``;
                    else{
                      SCMidCntr.appendChild(divMenuDisplay);

                      UpdateTotalDetails();

                      const btnATCV = document.getElementById(`${orderData.sizeId}-ATC-VARIANT`);
                      const btnAMV = document.getElementById(`${orderData.sizeId}-AM-VARIANT`);
                      if(btnATCV != null && btnAMV != null){
                        btnATCV.classList.remove("flex");
                        btnATCV.classList.add("hidden");
                        btnAMV.classList.add("flex");
                        btnAMV.classList.remove("hidden");
                        btnAMV.textContent = `Add more (${selectedCtr})`;

                        addEventsOnEditAndDeleteSvg(divMDRSBSCntr, orderData);
                      }
                    }
                  });
                }

                const btnAMVariant = document.createElement("button");
                btnAMVariant.id = `${sizeId}-AM-VARIANT`;
                classes = ["justify-center", "gap-[.3rem]", "p-[.2rem]", "cursor-pointer", "text-primaryColor", "border", "border-borderColor", "rounded-md"];
                btnAMVariant.classList.add(...classes);
                
                if(isExisting){
                  btnAMVariant.classList.add("flex");
                  btnAMVariant.textContent = `Add more (${currQty})`;
                }else{
                  btnAMVariant.classList.add("hidden");
                }

                btnAMVariant.addEventListener("click", async () => {
                  const order = await orderService.getOrderByNumber(element.id);

                  if(order != null || order != "" || order.length > 0){
                    let index = 0;
                    for(const item of order){
                      if(item.sizeId === null){
                        if(item.number === element.id)
                          break;
                      }else{
                        if(item.number === element.id && item.sizeId === sizeId)
                          break;
                      } 
                      index++;
                    }

                    const spanCMDTS = document.getElementById(`${sizeId}-MDQTY`);
                    const spanMDLSBS = document.getElementById(`${sizeId}-MDPRICE`);
                    
                    let qtyCtr = order[index].quantity + 1;

                    // Add updating of record using PATCH
                    const patchRequest = {
                      quantity: qtyCtr
                    };
                    
                    const response = await orderService.patchOrder(order[index].id, patchRequest);
                    if(response.status === 200){
                      btnAMVariant.textContent = `Add more (${qtyCtr})`;
                      spanCMDTS.textContent = `(${qtyCtr})`;
                      spanMDLSBS.textContent = formatAmount.format(sizePrice * qtyCtr);
                    }

                    UpdateTotalDetails();
                  }
                });
                
                divVariantPriceCntr.appendChild(spanProdVariant);
                divVariantPriceCntr.appendChild(spanProdVariantPrice);
                if(!isExisting)
                  divVariantPriceCntr.appendChild(btnATCVariant);
                divVariantPriceCntr.appendChild(btnAMVariant);

                divModalCntrChild.appendChild(divVariantPriceCntr);
              });

              divModalVariant.appendChild(divModalCntrChild);

              body.appendChild(divModalVariant);
            });
            btnATC.appendChild(spanBtnText);
          }else{ // WITHOUT VARIANT
            // Add to cart button
            classes = ["flex", "justify-center", "gap-[.3rem]", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
            btnATC.classList.add(...classes);
            btnATC.id = `${element.id}-ATC`;
    
            const spanPlusSymbol = document.createElement("span");
            const spanBtnText = document.createElement("span");
            spanPlusSymbol.textContent = "+";
            spanBtnText.textContent = "Add to Cart";
            
            btnATC.addEventListener("click", async () => {
              // Checks if it is existing
              const orderList = await orderService.getOrderByNumber(element.id);
              
              if(orderList === null || orderList === "" || orderList.length === 0){
                // Main Mid Container
                const SCMidCntr = document.getElementById("second-column-mid");
                // SCMidCntr.classList.add(...classes);
  
                // Child Container
                const divMenuDisplay = document.createElement("div");
                classes = ["flex", "border", "max-h-[4.15rem]", "border-borderColor", "p-[.5rem]", "gap-[.3rem]", "text-primaryColor", "font-semibold", "rounded-md"];
                divMenuDisplay.classList.add(...classes);
                divMenuDisplay.id = `${element.number}-MD`;
  
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
                spanCMDTS.id = `${element.id}-MDQTY`;
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
                spanMDLSBS.id = `${element.id}-MDPRICE`;
                spanMDLSBS.textContent = formatAmount.format(element.price);
                
                // SVG Container
                const divMDRSBSCntr = document.createElement("div");
                classes = ["flex", "gap-[.3rem]"];
                divMDRSBSCntr.classList.add(...classes);
  
                // Add edit & delete SVG
                divMDRSBSCntr.innerHTML = 
                `
                  <svg id="edit-order" width="12" height="12" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.3342 6.99391C26.6756 5.54064 27.3463 4.81402 28.0589 4.39017C29.7784 3.36747 31.8959 3.33566 33.6443 4.30627C34.3688 4.70854 35.06 5.41471 36.4426 6.82707C37.8251 8.23942 38.5165 8.94559 38.9102 9.68577C39.8604 11.4717 39.8293 13.6347 38.8281 15.3914C38.4132 16.1194 37.7018 16.8045 36.2793 18.1747L19.3526 34.4778C16.6567 37.0745 15.3088 38.3729 13.6241 39.0308C11.9394 39.6888 10.0873 39.6404 6.38321 39.5436L5.87925 39.5304C4.7516 39.5009 4.18777 39.4862 3.86003 39.1141C3.53226 38.7422 3.57701 38.1678 3.66651 37.0193L3.71511 36.3956C3.96698 33.1624 4.09291 31.546 4.72424 30.0929C5.35556 28.6397 6.44456 27.46 8.62254 25.1002L25.3342 6.99391Z" stroke="#161616" stroke-width="2.7" stroke-linejoin="round"/>
                    <path d="M23.3984 7.19995L35.9984 19.8" stroke="#161616" stroke-width="2.7" stroke-linejoin="round"/>
                    <path d="M25.1992 39.6001H39.5992" stroke="#161616" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
  
                  <svg id="delete-order" width="12" height="12" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  
                // Create JSON Object
                const orderData = {
                  receiptNo: receiptNo,
                  number: element.id,
                  shortFoodDesc: element.shortFoodDesc,
                  price: element.price,
                  discountAmount: discountAmt,
                  sizeId: null,
                  size: "None",
                  discountPercent: 0,
                  entryType: "ORDER",
                  quantity: selectedCtr,
                  placed: false,
                  tableId: null
                };
  
                const response = await orderService.postOrder(orderData);
                if(response.status != 201) // Resets the DOM of mid container
                  SCMidCntr.innerHTML = ``;
                else{
                  SCMidCntr.appendChild(divMenuDisplay);

                  UpdateTotalDetails((orderData.price * orderData.quantity));

                  const btnATC = document.getElementById(`${orderData.number}-ATC`);
                  const btnAM = document.getElementById(`${orderData.number}-AM`);
                  btnATC.classList.remove("flex");
                  btnATC.classList.add("hidden");
                  btnAM.classList.add("flex");
                  btnAM.classList.remove("hidden");
                  btnAM.textContent = `Add more (${selectedCtr})`;

                  // Move to a function and pass divMDRSBSCntr & element
                  addEventsOnEditAndDeleteSvg(divMDRSBSCntr, orderData);
                }
              }
            });

            btnATC.appendChild(spanPlusSymbol);
            btnATC.appendChild(spanBtnText);
          }
        }else{ 
          classes = ["flex", "justify-center", "gap-[.3rem]", "bg-primaryColor/50", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-not-allowed"];
          btnATC.classList.add(...classes);
          btnATC.id = `${element.id}-ATC`;
          btnATC.disabled = true;

          const spanPlusSymbol = document.createElement("span");
          const spanBtnText = document.createElement("span");
          spanPlusSymbol.textContent = "x";
          spanBtnText.textContent = "Not Available";
          btnATC.appendChild(spanPlusSymbol);
          btnATC.appendChild(spanBtnText);
        }

        // Add more button - will not be loaded on the DOM
        const btnAM = document.createElement("button");
        btnAM.id = `${element.id}-AM`;
        classes = ["hidden", "justify-center", "gap-[.3rem]", "py-[.2rem]", "cursor-pointer", "text-primaryColor", "border", "border-borderColor", "rounded-md"];
        btnAM.classList.add(...classes);

        btnAM.addEventListener("click", async () => {
          const order = await orderService.getOrderByNumber(element.id);
          console.log(order);

          if(order != null || order != "" || order.length > 0){
            // Locates which index
            let index = 0;
            for(const item of order){
              if(item.sizeId === null){
                if(item.number === element.id)
                  break;
              }else{
                if(item.number === element.id && item.sizeId === element.inventory.productVariant.size.id)
                  break;
              } 
              index++;
            }

            const spanCMDTS = document.getElementById(`${element.id}-MDQTY`);
            const spanMDLSBS = document.getElementById(`${element.id}-MDPRICE`);
            
            let qtyCtr = order[index].quantity + 1;

            // Add updating of record using PATCH
            const patchRequest = {
              quantity: qtyCtr
            };
            
            const response = await orderService.patchOrder(order[index].id, patchRequest);
            if(response.status === 200){
              btnAM.textContent = `Add more (${qtyCtr})`;
              spanCMDTS.textContent = `(${qtyCtr})`;
              spanMDLSBS.textContent = formatAmount.format(element.price * qtyCtr);
            }

            await UpdateTotalDetails(element.price);
          }
        });

        divMenuCntr.appendChild(img);
        divMenuCntr.appendChild(spanStatus);
        divMenuCntr.appendChild(divNameNPriceCntr);
        divMenuCntr.appendChild(btnATC);
        divMenuCntr.appendChild(btnAM);

        divFC.appendChild(divMenuCntr);
      });

      divSecondRow.appendChild(divFC);

      // Second Column
      const divSC = document.createElement("div");
      // classes = ["flex", "flex-col", "flex-1", "bg-primaryBg", "h-full", "rounded-md"];
      classes = ["flex", "flex-col", "flex-1", "min-h-0", "bg-primaryBg", "rounded-md"]
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
      spanRSTopSide.id = "receipt-no-value";
      // Create get method to check what is the last receipt no userd
      receiptNo = await orderService.getCurrentReceiptNo();
      spanRSTopSide.textContent = "#" + receiptNo;

      divSCChild.appendChild(spanLSTopSide);
      divSCChild.appendChild(spanRSTopSide);
      divSC.appendChild(divSCChild);

      // Middle Side
      const divSCChildMid = document.createElement("div");
      classes = ["flex", "flex-1", "flex-col", "gap-[.5rem]", "p-[.5rem]", "overflow-y-auto", "min-h-0"];
      divSCChildMid.classList.add(...classes);
      divSCChildMid.id = "second-column-mid";

      divSC.appendChild(divSCChildMid);

      // Bottom Side
      const divSCChildBottom = document.createElement("div");
      classes = ["flex", "flex-col", "gap-[.5rem]", "text-sm", "text-primaryColor", "font-semibold", "p-[.5rem]", "shrink-0"];
      divSCChildBottom.classList.add(...classes);

      // Transaction Details
      const divBTD = document.createElement("div");
      classes = ["border", "border-borderColor", "rounded-md", "p-[.3rem]"];
      divBTD.classList.add(...classes);
      // Top Side
      const divBTDTS = document.createElement("div");
      classes = ["flex", "flex-col", "gap-[.3rem]"];
      divBTDTS.classList.add(...classes);
      // SubTotal
      const divTDST = document.createElement("div");
      const sharedBottomClasses = ["flex", "justify-between"];
      divTDST.classList.add(...sharedBottomClasses);
      const spanTDST = document.createElement("span");
      spanTDST.textContent = "SubTotal";
      const spanTDSTP = document.createElement("span"); 
      spanTDSTP.id = "sub-total-price";
      spanTDSTP.textContent = formatAmount.format(0);
      divTDST.appendChild(spanTDST);
      divTDST.appendChild(spanTDSTP);
      // Taxes
      const taxDesc = localStorage.getItem("tax-description");
      const divTDT = document.createElement("div");
      divTDT.classList.add(...sharedBottomClasses);
      const spanTDT = document.createElement("span");
      spanTDT.textContent = "Taxes:";
      if(taxDesc === undefined || taxDesc === null || taxDesc === "")
        spanTDT.textContent += " (No Tax Set)";
      else
        spanTDT.textContent += ` ${taxDesc}`;
      const spanTDTP = document.createElement("span");
      spanTDTP.id = "taxes-price";
      spanTDTP.textContent = formatAmount.format(0);
      divTDT.appendChild(spanTDT);
      divTDT.appendChild(spanTDTP);
      // Discount
      const divTDD = document.createElement("div");
      classes = ["border-b", "border-borderColor", "mb-[.3rem]", "pb-[.3rem]"];
      divTDD.classList.add(...classes);
      divTDD.classList.add(...sharedBottomClasses);
      const spanTDD = document.createElement("span");
      spanTDD.textContent = "Discount"
      const spanTDDP = document.createElement("span");
      spanTDDP.id = "discount-price";
      spanTDDP.textContent = formatAmount.format(0);
      divTDD.appendChild(spanTDD);
      divTDD.appendChild(spanTDDP);
      divBTDTS.appendChild(divTDST);
      divBTDTS.appendChild(divTDT);
      divBTDTS.appendChild(divTDD);

      // Bottom Side
      const divBTDBS = document.createElement("div");
      divBTDBS.classList.add(...sharedBottomClasses);
      // Total Amount
      const spanBTDTP = document.createElement("span");
      spanBTDTP.textContent = "Total Amount";
      const spanBTDTPP = document.createElement("span");
      spanBTDTPP.id = "total-payment-price";
      spanBTDTPP.textContent = formatAmount.format(0);
      divBTDBS.appendChild(spanBTDTP);
      divBTDBS.appendChild(spanBTDTPP);
      
      divBTD.appendChild(divBTDTS);
      divBTD.appendChild(divBTDBS);

      // Order Information (Order Type & Table No)
      const divBOI = document.createElement("div");
      classes = ["border", "border-borderColor", "p-[.3rem]", "rounded-md"];
      divBOI.classList.add(...classes);
      // Order Type
      const divBOT = document.createElement("div");
      classes = ["border-b", "border-borderColor", "mb-[.3rem]", "pb-[.3rem]"];
      divBOT.classList.add(...sharedBottomClasses);
      divBOT.classList.add(...classes);
      const spanBOTT = document.createElement("span");
      spanBOTT.textContent = "Order Type";
      const selectBOTS = document.createElement("select");
      selectBOTS.id = "order-type";
      selectBOTS.add(new Option("Order Type", "", true, true));
      selectBOTS.options[0].disabled = true;
      const orderTypes = await orderTypeService.getOrderTypes();
      orderTypes.forEach(orderType => {
        selectBOTS.add(new Option(orderType.orderDesc, orderType.id));
      });
      // selectBOTS.add(new Option("Dine-in", "1"));
      // selectBOTS.add(new Option("Take out", "2"));
      divBOT.appendChild(spanBOTT);
      divBOT.appendChild(selectBOTS);
      
      // Table No
      // If take-out is selected make the table no. `NONE` :REMOVE-COMMENT
      const divBTN = document.createElement("div");
      divBTN.classList.add(...sharedBottomClasses);
      const spanBTNT = document.createElement("span");
      spanBTNT.textContent = "Select Table";
      const selectBTNS = document.createElement("select");
      selectBTNS.id = "table-no";
      selectBTNS.add(new Option("Table Option", "", true, true));
      selectBTNS.options[0].disabled = true;
      const tableList = await tableListService.getTables();
      tableList.forEach(table => {
        selectBTNS.add(new Option(table.tableName, table.id));
      });
      // selectBTNS.add(new Option("Table 1", "1"));
      // selectBTNS.add(new Option("Table 2", "2"));
      // selectBTNS.add(new Option("Table 3", "3"));
      divBTN.appendChild(spanBTNT);
      divBTN.appendChild(selectBTNS);

      divBOI.appendChild(divBOT);
      divBOI.appendChild(divBTN);

      // Add to table btn
      const btnAddToTable = document.createElement("button");
      classes = ["text-primaryBg", "bg-primaryColor/50", "p-[.3rem]", "cursor-not-allowed", "rounded-md"];
      btnAddToTable.classList.add(...classes);
      btnAddToTable.textContent = "Add to table";
      btnAddToTable.disabled = true;
      btnAddToTable.addEventListener("click", async () => {
        if(btnAddToTable.getAttribute("order-type") === "1"){ // DINE IN
          const lSelectBOTS = document.getElementById("order-type");
          const lSelectBTNS = document.getElementById("table-no");
          if(lSelectBOTS.selectedIndex != 0 && lSelectBTNS.selectedIndex != 0){ 
            // Checking if table already has menu (I think it is better that the cashier can add a new order even if there are still menu on a table)
            let response, patchRequest;
            const isTableAvailable = await orderService.getOrderByTableId(lSelectBTNS.selectedIndex);
            if(isTableAvailable.length > 0) { // If existing request
              // alert("You cannot add order here. There is an existing transaction on this table");
              // return; 
              
              const currentOrders = await orderService.getUnplacedOrders();
              
              let orders = [];
              currentOrders.forEach(order => {
                console.log(order);
                orders.push({
                  id: order.id,
                  number: order.number,
                  quantity: order.quantity,
                  sizeId: order.sizeId,
                  tableNo: lSelectBTNS.selectedIndex
                });
              });

              response = await orderService.patchOrdersByReceiptNo(receiptNo, orders);
            }else{ // If not existing request
              patchRequest = {
                tableNo: lSelectBTNS.selectedIndex,
                placed: true,
                orderType: lSelectBOTS.selectedIndex
              }

              response = await orderService.patchOrderByReceiptNo(receiptNo, patchRequest);
            }

            
            if(response.status === 200){
              alert(`Order is placed on table ${lSelectBTNS.selectedIndex}`);
              window.location.reload();
            }else{
              alert("There was a problem updating the record. Please try again");
            }
          }
        }else if(btnAddToTable.getAttribute("order-type") === "2"){ // TAKE OUT
          console.log("Should proceed to payment")
        }
      });

      selectBOTS.addEventListener("change", async (event) => {
        const selected = event.target.value;
        if(selected == "2"){
          selectBTNS.disabled = true;
          selectBTNS.selectedIndex = 0;
          selectBTNS.options[0].textContent = "N/A";
          selectBTNS.options[0].value = "N/A";

          // Proceed to payment logic - TAKE OUT
          btnAddToTable.textContent = "Prooced to payment";
          btnAddToTable.setAttribute("order-type", "2");
          btnAddToTable.disabled = false;
          classes = ["bg-primaryColor/50", "cursor-not-allowed"]
          btnAddToTable.classList.remove(...classes);
          classes = ["bg-primaryColor", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"]
          btnAddToTable.classList.add(...classes);
        }else{
          selectBTNS.disabled = false;
          selectBTNS.options[0].textContent = "Table Option";
          selectBTNS.options[0].value = "";
          
          // Add to table logic - DINE IN
          btnAddToTable.textContent = "Add to table";
          btnAddToTable.setAttribute("order-type", "1");
          
          if(selectBOTS.selectedIndex > 0 && selectBTNS.selectedIndex > 0){ // Allows submission

            const isEmpty = await CheckIfTableHasExistingOrder(); 
            if(isEmpty != "")
              receiptNo = isEmpty;

            btnAddToTable.disabled = false;
            classes = ["bg-primaryColor/50", "cursor-not-allowed"]
            btnAddToTable.classList.remove(...classes);
            classes = ["bg-primaryColor", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"]
            btnAddToTable.classList.add(...classes);
          }else{
            btnAddToTable.disabled = true;
            classes = ["bg-primaryColor", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"]
            btnAddToTable.classList.remove(...classes);
            classes = ["bg-primaryColor/50", "cursor-not-allowed"]
            btnAddToTable.classList.add(...classes);
          }
        }
      });

      selectBTNS.addEventListener("change", async (event) => {
        if(selectBOTS.selectedIndex > 0 && selectBTNS.selectedIndex > 0){ // Allows submission

          const isEmpty = await CheckIfTableHasExistingOrder();
          if(isEmpty != "")
            receiptNo = isEmpty;

          btnAddToTable.disabled = false;
          classes = ["bg-primaryColor/50", "cursor-not-allowed"]
          btnAddToTable.classList.remove(...classes);
          classes = ["bg-primaryColor", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"]
          btnAddToTable.classList.add(...classes);
        }else{
          btnAddToTable.disabled = true;
          classes = ["bg-primaryColor", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"]
          btnAddToTable.classList.remove(...classes);
          classes = ["bg-primaryColor/50", "cursor-not-allowed"]
          btnAddToTable.classList.add(...classes);
        }
      });

      divSCChildBottom.appendChild(divBTD);
      divSCChildBottom.appendChild(divBOI);
      divSCChildBottom.appendChild(btnAddToTable);

      divSC.appendChild(divSCChildBottom);

      divSecondRow.appendChild(divSC);

      section.appendChild(divSecondRow);
      container.appendChild(section);

      // Checking if there are existing orders
      // const elementArr = await orderService.getOrders();
      const elementArr = await orderService.getUnplacedOrders();
      if(elementArr.length > 0){
        displayActiveTrans(elementArr);
      }
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

  function displayActiveTrans(elementArr){
    // Main Mid Container
    const SCMidCntr = document.getElementById("second-column-mid");
    // SCMidCntr.classList.add(...classes);

    // const tableId = elementArr[0];

    elementArr.forEach(element => {
      // Child Container
      const divMenuDisplay = document.createElement("div");
      classes = ["flex", "border", "max-h-[4.15rem]", "border-borderColor", "p-[.5rem]", "gap-[.3rem]", "text-primaryColor", "font-semibold", "rounded-md"];
      divMenuDisplay.classList.add(...classes);
      divMenuDisplay.id = `${element.number}-MD`;

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
      
      const spanCMDTS = document.createElement("span");
      classes = ["text-secondaryColor/50", "font-normal", "leading-none"];
      spanCMDTS.classList.add(...classes);
      spanCMDTS.textContent = `(${element.quantity})`;
      
      if(element.sizeId != null){
        spanCMDTS.id = `${element.sizeId}-MDQTY`;
      }else{
        spanCMDTS.id = `${element.number}-MDQTY`;
      }
      
      divMDTSFCCntr.appendChild(spanFDMDTS);
      divMDTSFCCntr.appendChild(spanCMDTS);

      // Size Display
      const spanSMDTS = document.createElement("span");
      classes = ["text-[.7rem]", "text-secondaryColor", "font-medium", "leading-none", "whitespace-pre"];
      spanSMDTS.classList.add(...classes);
      if(element.sizeId != null){
        spanSMDTS.textContent = `\tSize:${element.size}`;
      }else{
        spanSMDTS.textContent = "\tSize:None"
      }
      
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
      if(element.sizeId != null){
        spanMDLSBS.id = `${element.sizeId}-MDPRICE`;
      }else{
        spanMDLSBS.id = `${element.number}-MDPRICE`;
      }
      spanMDLSBS.textContent = formatAmount.format(element.price * element.quantity);
      
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

      if(element.sizeId != null){
        // Editing of button should happend during opening of modal

      }else{
        const btnATC = document.getElementById(`${element.number}-ATC`);
        const btnAM = document.getElementById(`${element.number}-AM`);

        if(btnATC != null && btnAM != null){
          btnATC.classList.remove("flex");
          btnATC.classList.add("hidden");
          btnAM.classList.add("flex");
          btnAM.classList.remove("hidden");
          btnAM.textContent = `Add more (${element.quantity})`;
          
          addEventsOnEditAndDeleteSvg(divMDRSBSCntr, element);
        }
      }
    });

    UpdateTotalDetails();
  }

  async function UpdateTotalDetails(){
    // Add the logic on dynamically changing the prices.
    const stp = document.getElementById("sub-total-price");
    const tp = document.getElementById("taxes-price");
    const dp = document.getElementById("discount-price");
    const tpp = document.getElementById("total-payment-price");

    const taxPercentage = localStorage.getItem("tax-percent");

    const orderAmt = await orderService.getOrderSumUnplaced();

    // Tax
    let taxAmt = 0;
    if(!isNaN(taxPercentage)){
      taxAmt = (orderAmt / (taxPercentage / 100 + 1)) * (taxPercentage / 100);
    }

    let formattedPhpAmt = "";
    stp.textContent = formatAmount.format(orderAmt - taxAmt);
    tp.textContent = formatAmount.format(taxAmt);
    tpp.textContent = formatAmount.format(orderAmt);
  }

  function addEventsOnEditAndDeleteSvg(svgCntrRef, element){
    const deleteSvgRef = svgCntrRef.children[1];
    classes = ["cursor-pointer"];
    deleteSvgRef.classList.add(...classes);
    deleteSvgRef.addEventListener("click", () => {
      // Delete by receipt no & food id
      const body = document.getElementById("body");

      const divModalDelete = document.createElement("div");
      classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryColor", "z-[3]"];
      divModalDelete.classList.add(...classes);

      const divModalChildDeleteCntr = document.createElement("div");
      classes = ["flex", "gap-[.6rem]", "flex-col", "bg-primaryBg", "p-3", "rounded-md", "w-[50%]"];
      divModalChildDeleteCntr.classList.add(...classes);

      const spanCaption = document.createElement("span");
      classes = ["font-bold", "text-[1.2rem]", "border-b", "border-borderColor"];
      spanCaption.classList.add(...classes);
      spanCaption.textContent = `Are you sure you want to delete ${element.shortFoodDesc}?`;
      divModalChildDeleteCntr.appendChild(spanCaption);

      const divModalBtnCntr = document.createElement("div");
      classes = ["flex", "gap-[.3rem]", "w-[25%]"];
      divModalBtnCntr.classList.add(...classes);

      const btnYes = document.createElement("button");
      classes = ["p-2", "rounded-md", "bg-sucessConfirm", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-sucessConfirm/50"];
      btnYes.classList.add(...classes);
      btnYes.textContent = "Yes";
      divModalBtnCntr.appendChild(btnYes);
      btnYes.addEventListener("click",async () => {
        const deleteRequest = {
          receiptNo: element.receiptNo,
          number: element.number
        };

        const response = await orderService.deleteOrder(deleteRequest);
        if(response.status === 200){
          window.location.reload();
          alert(`${element.shortFoodDesc} was successfully removed.`);
        }else{
          alert("There was a problem removing order. Please try again");
        }
      });
      
      const btnNo = document.createElement("button");
      classes = ["p-2", "rounded-md", "bg-errorAlert", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-errorAlert/50"];
      btnNo.classList.add(...classes);
      btnNo.textContent = "No";
      divModalBtnCntr.appendChild(btnNo);
      btnNo.addEventListener("click", () => {
        body.removeChild(divModalDelete);
      });
      
      divModalChildDeleteCntr.appendChild(divModalBtnCntr);
      divModalDelete.appendChild(divModalChildDeleteCntr);
      body.appendChild(divModalDelete);
    });
  }

  async function CheckIfTableHasExistingOrder(){
    // Checks if there is an existing order on the table & changes the receipt no.
    const lSelectBTNS = document.getElementById("table-no");
    const existingOrderByTableId = await orderService.getOrderByTableId(lSelectBTNS.selectedIndex);
    if(existingOrderByTableId.length > 0) {
      const orderList = existingOrderByTableId[0];

      const receiptNoRef = document.getElementById("receipt-no-value");
      receiptNoRef.textContent = "#" + orderList.receiptNo;

      alert(`Receipt No. is changed. There is an existing transcation on the table selected`);

      return orderList.receiptNo;
    }
    
    return "";
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