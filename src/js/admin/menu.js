import { categoryService } from "../services/categoryservice";
import { foodService } from "../services/foodservice";
import { sizeService } from "../services/sizeService";
import { createOkButton, createCancelBtn, removeParams } from '../utilities';

// Add fetch of sizes for existing product with variant. It should be on select tag :REMOVE-COMMENT 
// Pagisipan itong comment sa taas since meron na pala sa reponse ng details. maybe need lang yung ganito kapag adding of new value? :REMOVE-COMMENT
// Or pwede itulad dun sa yes or no na variant if != null gawing selected value :REMOVE-COMMENT

export async function renderMenu(container){
  const formatAmount = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  });

  sessionStorage.setItem("active-tab", "menu");

  let classes;
  let totalCatCnt = 0;

  const categoriesCount = await categoryService.getCategoriesCount();
  const categories = await categoryService.getCategories();

  if(categoriesCount)
    totalCatCnt = categoriesCount.length;

  const section = document.createElement("section");
  classes = ["flex", "flex-col", "bg-secondaryBg", "h-full", "min-h-0"];
  section.classList.add(...classes);
  section.id = "menu-container";

  // First Row
  const divFirstRow = document.createElement("div");
  classes = ["flex-1", "flex", "flex-col", "gap-[.6rem]", "border-b-1", "border-borderColor", "p-3"];
  divFirstRow.classList.add(...classes);

  // First Row Top Side
  const divFRTS = document.createElement("div");
  divFRTS.id = "first-row-top-side";
  classes = ["flex", "gap-2"];
  divFRTS.classList.add(...classes);
  
  const btnAddMenu = document.createElement("button");
  btnAddMenu.textContent = "ADD MENU";
  classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
  btnAddMenu.classList.add(...classes);
  btnAddMenu.addEventListener("click", () => {
    // Popup for adding new menu :REMOVE-COMMENT
  });
  divFRTS.appendChild(btnAddMenu);
  
  const btnAddVariant = document.createElement("button");
  btnAddVariant.textContent = "ADD VARIANT";
  classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
  btnAddVariant.classList.add(...classes);
  btnAddVariant.addEventListener("click", () => {
    // Popup for adding new variant :REMOVE-COMMENT
    // In variant it should have another PK where is has name on it like for example. Size1[12oz, 16oz, 32oz,], Size2[12oz, 18oz, 32oz] :REMOVE-COMMENT
  });
  divFRTS.appendChild(btnAddVariant);
  
  const btnAddCategory = document.createElement("button");
  btnAddCategory.textContent = "ADD MENU";
  classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
  btnAddCategory.classList.add(...classes);
  btnAddCategory.addEventListener("click", () => {
    // Popup for adding new category :REMOVE-COMMENT
  });
  divFRTS.appendChild(btnAddCategory);

  // First Row Bottom Side
  const divFRBS = document.createElement("div");
  divFRBS.id = "first-row-bottom-side";
  classes = ["flex", "gap-2"];
  divFRBS.classList.add(...classes);

  const btnAll = document.createElement("button");
  btnAll.textContent = "ALL";
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

  divFRBS.appendChild(btnAll);

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

    divFRBS.appendChild(btn); 
  }

  divFirstRow.appendChild(divFRTS);
  divFirstRow.appendChild(divFRBS);

  
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

  function displayMenuList(menuList){
    if(section.children.length === 2){ // Deletes the first DOM
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

      console.log(menuList);
      menuList.forEach(element => {
        const inventory = element.inventory;

        const divMenuCntr = document.createElement("div");
        classes = ["flex", "flex-col", "h-[100%]", "gap-[.5rem]", "relative", "bg-primaryBg", "p-2", "rounded-sm"];
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
          displayMenuStatus(spanStatus, element.quantity);
        }
        
        // Menu Name & Menu Price
        const divNameNPriceCntr = document.createElement("div");
        classes = ["flex", "justify-between", "text-sm", "font-semibold", "text-primaryColor"];
        divNameNPriceCntr.classList.add(...classes);

        const spanName = document.createElement("span");
        spanName.textContent = element.shortFoodDesc;
        divNameNPriceCntr.appendChild(spanName);
        
        // Inventory Container
        const divInventoryCntr = document.createElement("div");
        if(!element.withVariant){
          // Price
          const price = element.price;
          const spanPrice = document.createElement("span");
          spanPrice.textContent = formatAmount.format(price);  
          divNameNPriceCntr.appendChild(spanPrice);
          
          classes = ["flex", "justify-between", "text-sm", "font-semibold", "text-primaryColor"];
          divInventoryCntr.classList.add(...classes);
          
          // Inventory total qty
          const spanInvName = document.createElement("span");
          spanInvName.textContent = "No. of Item/s in stock";
          divInventoryCntr.appendChild(spanInvName);
          
          const spanInv = document.createElement("span");
          spanInv.textContent = element.quantity + "pcs";
          divInventoryCntr.appendChild(spanInv);
        }else{
          // 
          element.inventory.forEach(async (prodVariant) => {
            classes = ["flex", "justify-between", "text-sm", "font-semibold", "text-primaryColor"];
            divInventoryCntr.classList.add(...classes);

            const divInvChildCntr = document.createElement("div");
            classes = ["flex", "gap-[.2rem]"];
            divInvChildCntr.classList.add(...classes);
            // Inventory total qty
            const spanInvName = document.createElement("span");
            spanInvName.textContent = prodVariant.productVariant.size.sizeName + ':';
            divInvChildCntr.appendChild(spanInvName);
            
            const spanInv = document.createElement("span");
            spanInv.textContent = prodVariant.quantity + "pcs";
            divInvChildCntr.appendChild(spanInv);
            
            divInventoryCntr.appendChild(divInvChildCntr);
          });
        }
        
        const actionBtnCntr = document.createElement("div");
        classes = ["flex", "h-[100%]", "items-end"];
        actionBtnCntr.classList.add(...classes);
        const actionBtn = document.createElement("button");
        if(element.quantity != 0){
          if(false){ // element.withVariant
            actionBtn.textContent = "Check Variant Prices"
            classes = ["w-full", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
            actionBtn.classList.add(...classes);
            actionBtn.addEventListener("click", () => {
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

                divVariantPriceCntr.appendChild(spanProdVariant);
                divVariantPriceCntr.appendChild(spanProdVariantPrice);
                divModalCntrChild.appendChild(divVariantPriceCntr);
              });

              divModalVariant.appendChild(divModalCntrChild);

              body.appendChild(divModalVariant);
            });
            actionBtnCntr.appendChild(actionBtn);
          }else{
            actionBtn.textContent = "Edit";
            classes = ["w-full", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
            actionBtn.classList.add(...classes);
            actionBtn.addEventListener("click", async () => {
              // Popup modal for editing. Can only edit name, price, img, category, and variant :REMOVE-COMMENT
              // If the variant is true before and passed as false. Delete related record from product_variant table :REMOVE-COMMENT 

              const url = new URL(window.location.href);
              url.searchParams.set("food", element.id);
              window.history.pushState({}, "", url);

              const body = document.getElementById("body")

              const divEditPopup = document.createElement("div");
              classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
              divEditPopup.classList.add(...classes);

              const divEditPopupCntr = document.createElement("div");
              classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
              divEditPopupCntr.classList.add(...classes);

              const formMenuDetails = document.createElement("form");     
              classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
              formMenuDetails.classList.add(...classes);
              
              // Menu name
              const divMenuNameCntr = document.createElement("div");
              const inputMenuName = document.createElement("input");
              classes = ["w-full", "border-[.1rem]", "border-black"];
              inputMenuName.classList.add(...classes);
              inputMenuName.id = "menu-name";
              inputMenuName.type = "text";
              inputMenuName.value = element.foodName;
              const lblMenuName = document.createElement("label");
              lblMenuName.for = "menu-name";
              lblMenuName.textContent = "Menu Name";
              divMenuNameCntr.appendChild(lblMenuName);
              divMenuNameCntr.appendChild(inputMenuName);
              formMenuDetails.appendChild(divMenuNameCntr);

              // Menu price
              const divMenuPriceCntr = document.createElement("div");
              const inputMenuPrice = document.createElement("input");
              classes = ["w-full", "border-[.1rem]", "border-black"];
              inputMenuPrice.classList.add(...classes);
              inputMenuPrice.id = "menu-price";
              inputMenuPrice.type = "text";
              if(!element.withVariant)
                inputMenuPrice.value = element.price;
              const lblMenuPrice = document.createElement("label");
              lblMenuPrice.for = "menu-price";
              lblMenuPrice.textContent = "Menu Price";
              divMenuPriceCntr.appendChild(lblMenuPrice);
              divMenuPriceCntr.appendChild(inputMenuPrice);
              formMenuDetails.appendChild(divMenuPriceCntr);

              // Menu category
              const divMenuCatCntr = document.createElement("div");
              const selectMenuCat = document.createElement("select");
              classes = ["w-full", "border-[.1rem]", "border-black"];
              selectMenuCat.classList.add(...classes);
              selectMenuCat.id = "menu-category";
              categories.forEach(category  => {
                if(element.categoryType == category.code){
                  selectMenuCat.add(new Option(category.code, category.code, true, true));
                }else{
                  selectMenuCat.add(new Option(category.code, category.code));
                }
              });
              const lblMenuCat = document.createElement("label");
              lblMenuCat.for = "menu-category";
              lblMenuCat.textContent = "Menu Category";
              divMenuCatCntr.appendChild(lblMenuCat);
              divMenuCatCntr.appendChild(selectMenuCat);
              formMenuDetails.appendChild(divMenuCatCntr);
              
              // Menu variant
              const divMenuVariantCntr = document.createElement("div");
              classes = ["flex", "flex-col", "gap-[.3rem]"];
              divMenuVariantCntr.classList.add(...classes);
              const selectMenuVariant = document.createElement("select");
              
              const divMenuVariantDetCntr = document.createElement("div");
              classes = ["hidden", "flex-col", "gap-[.3rem]"];
              divMenuVariantDetCntr.id = "edit-popup-menu-variant"
              divMenuVariantDetCntr.classList.add(...classes); 
              
              const sizes = await sizeService.getSizes();

              // Add more button.
              const addMoreBtn = document.createElement("button");
              classes = ["bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "p-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
              addMoreBtn.classList.add(...classes);
              addMoreBtn.textContent = "Add more variant";
              addMoreBtn.type = "button";
              divMenuVariantDetCntr.appendChild(addMoreBtn);
              addMoreBtn.addEventListener("click", () => {
                const divMenuVariantDetChildCntr = document.createElement("div");
                classes = ["flex", "gap-[.3rem]"];
                divMenuVariantDetChildCntr.classList.add(...classes);

                // Delete SVG
                const divDeleteSvgCntr = document.createElement("div");
                classes = ["flex", "justify-center", "items-center"];
                divDeleteSvgCntr.classList.add(...classes);
                divDeleteSvgCntr.id = "delete-variant-svg-cntr";
                divDeleteSvgCntr.innerHTML = `
                  <svg class="cursor-pointer stroke-errorAlert hover:stroke-errorAlert/50" width="25" height="25" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.1016 9.90002L33.9861 27.9452C33.701 32.5555 33.5586 34.8608 32.403 36.5182C31.8315 37.3376 31.096 38.0292 30.2428 38.5488C28.5173 39.6 26.2078 39.6 21.5884 39.6C16.9632 39.6 14.6505 39.6 12.9239 38.5468C12.0702 38.0263 11.3344 37.3335 10.7632 36.5127C9.60795 34.8527 9.46857 32.5442 9.18986 27.9274L8.10156 9.90002" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M5.39844 9.89998H37.7984M28.8987 9.89998L27.67 7.36509C26.8537 5.68124 26.4455 4.83931 25.7415 4.31423C25.5854 4.19776 25.42 4.09415 25.247 4.00444C24.4675 3.59998 23.5318 3.59998 21.6605 3.59998C19.7423 3.59998 18.7832 3.59998 17.9907 4.02139C17.815 4.11479 17.6474 4.2226 17.4896 4.34368C16.7774 4.89004 16.3796 5.76277 15.5839 7.50824L14.4937 9.89998" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M17.1016 29.7V18.9" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M26.1016 29.7V18.9" stroke-width="2.7" stroke-linecap="round"/>
                  </svg>
                `;
                divDeleteSvgCntr.addEventListener("click", () => {
                  deleteVariant(divMenuVariantDetCntr, divMenuVariantDetChildCntr);
                });
                divMenuVariantDetChildCntr.appendChild(divDeleteSvgCntr);

                const divSizeNameCtr = document.createElement("div");
                // Size name
                const selectSizeName = document.createElement("select");
                classes = ["w-[100%]", "border-[.1rem]", "border-black"];
                selectSizeName.classList.add(...classes);
                selectSizeName.id = "menu-size-name";
                sizes.forEach(size => {
                  selectSizeName.add(new Option(`${size.sizeName}`, size.id));
                });
                const lblSizeName = document.createElement("label");
                lblSizeName.textContent = "Size Name";
                lblSizeName.for = "menu-size-name";
                divSizeNameCtr.appendChild(lblSizeName);
                divSizeNameCtr.appendChild(selectSizeName);
                divMenuVariantDetChildCntr.appendChild(divSizeNameCtr);
                
                const divSizePriceCntr = document.createElement("div");
                // Size price
                const inputSizePrice = document.createElement("input");
                inputSizePrice.classList.add(...classes);
                inputSizePrice.type = "text";
                inputSizePrice.id = "menu-size-prize";
                const lblSizePrice = document.createElement("label");
                lblSizePrice.textContent = "Size Price";
                lblSizePrice.for = "menu-size-price";
                divSizePriceCntr.appendChild(lblSizePrice);
                divSizePriceCntr.appendChild(inputSizePrice); 
                divMenuVariantDetChildCntr.appendChild(divSizePriceCntr);
                divMenuVariantDetCntr.appendChild(divMenuVariantDetChildCntr)
                divMenuVariantCntr.appendChild(divMenuVariantDetCntr);
              });

              // variant option should be select :REMOVE-COMMENT
              // Variant Details
              inventory?.forEach(varaint => {
                const divMenuVariantDetChildCntr = document.createElement("div");
                classes = ["flex", "gap-[.3rem]"];
                divMenuVariantDetChildCntr.classList.add(...classes);

                const divDeleteSvgCntr = document.createElement("div");
                classes = ["flex", "justify-center", "items-center"];
                divDeleteSvgCntr.classList.add(...classes);
                divDeleteSvgCntr.id = "delete-variant-svg-cntr";
                divDeleteSvgCntr.innerHTML = `
                  <svg class="cursor-pointer stroke-errorAlert hover:stroke-errorAlert/50" width="25" height="25" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.1016 9.90002L33.9861 27.9452C33.701 32.5555 33.5586 34.8608 32.403 36.5182C31.8315 37.3376 31.096 38.0292 30.2428 38.5488C28.5173 39.6 26.2078 39.6 21.5884 39.6C16.9632 39.6 14.6505 39.6 12.9239 38.5468C12.0702 38.0263 11.3344 37.3335 10.7632 36.5127C9.60795 34.8527 9.46857 32.5442 9.18986 27.9274L8.10156 9.90002" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M5.39844 9.89998H37.7984M28.8987 9.89998L27.67 7.36509C26.8537 5.68124 26.4455 4.83931 25.7415 4.31423C25.5854 4.19776 25.42 4.09415 25.247 4.00444C24.4675 3.59998 23.5318 3.59998 21.6605 3.59998C19.7423 3.59998 18.7832 3.59998 17.9907 4.02139C17.815 4.11479 17.6474 4.2226 17.4896 4.34368C16.7774 4.89004 16.3796 5.76277 15.5839 7.50824L14.4937 9.89998" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M17.1016 29.7V18.9" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M26.1016 29.7V18.9" stroke-width="2.7" stroke-linecap="round"/>
                  </svg>
                `;
                divDeleteSvgCntr.addEventListener("click", () => {
                  deleteVariant(divMenuVariantDetCntr, divMenuVariantDetChildCntr);
                });
                divMenuVariantDetChildCntr.appendChild(divDeleteSvgCntr);

                const divSizeNameCtr = document.createElement("div");
                // Size name
                const selectSizeName = document.createElement("select");
                classes = ["w-[100%]", "border-[.1rem]", "border-black"];
                selectSizeName.classList.add(...classes);
                selectSizeName.id = "menu-size-name" + varaint.productVariant.size.sizeName;
                sizes.forEach(size => {
                  if(varaint.productVariant.size.id == size.id)
                    selectSizeName.add(new Option(`${size.sizeName}`, size.id, true, true));
                  else
                    selectSizeName.add(new Option(`${size.sizeName}`, size.id));
                });
                const lblSizeName = document.createElement("label");
                lblSizeName.textContent = "Size Name";
                lblSizeName.for = "menu-size-name" + varaint.productVariant.size.sizeName;
                divSizeNameCtr.appendChild(lblSizeName);
                divSizeNameCtr.appendChild(selectSizeName);
                divMenuVariantDetChildCntr.appendChild(divSizeNameCtr);
                
                const divSizePriceCntr = document.createElement("div");
                // Size price
                const inputSizePrice = document.createElement("input");
                inputSizePrice.classList.add(...classes);
                inputSizePrice.type = "text";
                inputSizePrice.id = "menu-size-prize" + varaint.productVariant.size.sizeName;
                inputSizePrice.value = varaint.productVariant.price;
                const lblSizePrice = document.createElement("label");
                lblSizePrice.textContent = "Size Price";
                lblSizePrice.for = "menu-size-price" + varaint.productVariant.size.sizeName;
                divSizePriceCntr.appendChild(lblSizePrice);
                divSizePriceCntr.appendChild(inputSizePrice); 
                divMenuVariantDetChildCntr.appendChild(divSizePriceCntr);

                
                divMenuVariantDetCntr.appendChild(divMenuVariantDetChildCntr);
              });

              classes = ["border-[.1rem]", "border-black"];
              selectMenuVariant.classList.add(...classes);
              selectMenuVariant.id = "menu-variant";
              const lblMenuVariant = document.createElement("label");
              lblMenuVariant.for = "menu-variant";
              lblMenuVariant.textContent = "Menu Variant";
              divMenuVariantCntr.appendChild(lblMenuVariant);
              divMenuVariantCntr.appendChild(selectMenuVariant);
              divMenuVariantCntr.appendChild(divMenuVariantDetCntr);
              
              selectMenuVariant.addEventListener("change", (event) => {
                // Should display variants :REMOVE-COMMENT
                let value = event.target.value;
                inputMenuPrice.disabled = value == "true";

                if(value == "true"){
                  divMenuVariantDetCntr.classList.add("flex");
                  divMenuVariantDetCntr.classList.remove("hidden");
                }else{
                  divMenuVariantDetCntr.classList.remove("flex");
                  divMenuVariantDetCntr.classList.add("hidden");
                }
              });
              
              if(element.inventory != null){
                selectMenuVariant.add(new Option("No", false));
                selectMenuVariant.add(new Option("Yes", true, true, true));
                selectMenuVariant.dispatchEvent(new Event("change"));
              }else{
                selectMenuVariant.add(new Option("No", false, true, true));
                selectMenuVariant.add(new Option("Yes", true));
              }
              
              formMenuDetails.appendChild(divMenuVariantCntr);

              const divBtnCntr = document.createElement("div");
              classes = ["col-span-full", "flex", "gap-[.3rem]"];
              divBtnCntr.classList.add(...classes);

              const btnOk = createOkButton();
              btnOk.type = "button";
              divBtnCntr.appendChild(btnOk);

              const btnCancel = createCancelBtn();
              btnCancel.type = "button";
              divBtnCntr.appendChild(btnCancel);

              formMenuDetails.appendChild(divBtnCntr);
              divEditPopupCntr.appendChild(formMenuDetails);
              divEditPopup.appendChild(divEditPopupCntr);
              body.appendChild(divEditPopup);
              
              btnCancel.addEventListener("click", () => {
                removeParams();
                body.removeChild(divEditPopup);
              });
            });
            actionBtnCntr.appendChild(actionBtn);
          }
        }else{
          classes = ["w-full", "bg-primaryColor/50", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-not-allowed"];
          actionBtn.textContent = " X Not Available";
          actionBtn.classList.add(...classes);
          actionBtn.disabled = true;
          actionBtnCntr.appendChild(actionBtn);
        }

        divMenuCntr.appendChild(img);
        divMenuCntr.appendChild(spanStatus);
        divMenuCntr.appendChild(divNameNPriceCntr);
        divMenuCntr.appendChild(divInventoryCntr);
        divMenuCntr.appendChild(actionBtnCntr);

        divFC.appendChild(divMenuCntr);
      });
      
      divSecondRow.appendChild(divFC);
      section.appendChild(divSecondRow);
      container.appendChild(section);
      // divSCChildBottom.appendChild(divBTD);
      // divSCChildBottom.appendChild(divBOI);
      // divSCChildBottom.appendChild(btnAddToTable);

      // divSC.appendChild(divSCChildBottom);

      // divSecondRow.appendChild(divSC);
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
      const divChild = divParent.lastChild;

      for(const btn of divChild.children)
        btn.classList.remove("active");

      btnRef.classList.add("active");
    }
  }

  function deleteVariant(pMenuVariantParent, pMenuVariantChild){
    const body = document.getElementById("body");
    
    const divConfirmationPopup = document.createElement("div")
    classes = ["flex", "justify-center", "items-center", "text-primaryColor", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
    divConfirmationPopup.classList.add(...classes);
    
    const divConfirmationPopupCntr = document.createElement("div");
    classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
    divConfirmationPopupCntr.classList.add(...classes);
    const spanMessage = document.createElement("span");
    classes = ["text-xl"];
    spanMessage.classList.add(...classes);
    spanMessage.textContent = "Are you sure you want to delete?";
    divConfirmationPopupCntr.appendChild(spanMessage);
    const btnCntr = document.createElement("div");
    classes = ["flex", "gap-[.3rem]"];
    btnCntr.classList.add(...classes);
    const btnOk = createOkButton();
    btnCntr.appendChild(btnOk);
    const btnCancel = createCancelBtn();
    btnCntr.appendChild(btnCancel);
    divConfirmationPopupCntr.appendChild(btnCntr);
    divConfirmationPopup.appendChild(divConfirmationPopupCntr);
    body.appendChild(divConfirmationPopup);

    btnOk.addEventListener("click", () => {
      // Should also check if it is existing in table if yes delete it on the table too & DOM:REMOVE-COMMENT
      pMenuVariantParent.removeChild(pMenuVariantChild);
      body.removeChild(divConfirmationPopup);
    });
    
    btnCancel.addEventListener("click", () => {
      body.removeChild(divConfirmationPopup);
    });
  }
}