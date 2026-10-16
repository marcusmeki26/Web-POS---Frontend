import { categoryService } from "../../services/categoryservice";
import { foodService } from "../../services/foodservice";
import { sizeService } from "../../services/sizeService";
import { createOkButton, createCancelBtn, removeParams } from '../../utilities';

// No add variant functionality :REMOVE-COMMENT
// No add category functionlity :REMOVE-COMMENT
// Move variant and category on its own page :REMOVE-COMMENT

export async function renderFood(container){
  const formatAmount = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  });

  sessionStorage.setItem("active-tab", "food");

  let classes;
  let totalCatCnt = 0;

  const categoriesCount = await categoryService.getCategoriesCount();
  let categories = [];
  await categoryService.getCategories()
    .then(response => {
      if(response.status == 200)
        categories = response.data;
      else
        console.error("Unhandled status code: ", response.status);
    })
    .catch(error => {
      console.error("There was a problem fetching categories: " + error);
    });
  
  let sizes = [];
  await sizeService.getSizes()
    .then(response => {
      if(response.status == 200)
        sizes = response.data;
      else
        console.error("Unhandled status code: " + response.data);
    })
    .catch(error => {
      console.error("There was a problem fetching sizes: " + error);
    });

  if(categoriesCount){
    for(const category of categoriesCount){
      totalCatCnt += category.categoryCount;
    }
  }

  const section = document.createElement("section");
  classes = ["flex", "flex-col", "bg-secondaryBg", "h-full", "min-h-0"];
  section.classList.add(...classes);
  section.id = "food-container";

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
    const body = document.getElementById("body"); 

    const divAddPopup = document.createElement("div");
    classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
    divAddPopup.classList.add(...classes);
        
    const divAddPopupCntr = document.createElement("div");
    classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
    divAddPopupCntr.classList.add(...classes);

    const spanAddTitle = document.createElement("span");
    classes = ["text-3xl", "font-extrabold", "text-primaryColor"];
    spanAddTitle.classList.add(...classes);
    spanAddTitle.textContent = "Add food";
    divAddPopupCntr.appendChild(spanAddTitle);

    const formAddPopup = document.createElement("form");
    classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
    formAddPopup.classList.add(...classes);
    
    // Menu name
    const divMenuNameCntr = document.createElement("div");
    const inputMenuName = document.createElement("input");
    classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
    inputMenuName.classList.add(...classes);
    inputMenuName.type = "text";
    inputMenuName.id = "input-menu-name";
    const lblMenuName = document.createElement("label");
    classes = ["text-primaryColor", "font-extrabold"];
    lblMenuName.classList.add(...classes);
    lblMenuName.textContent = "Menu Name";
    lblMenuName.for = "input-menu-name";
    divMenuNameCntr.appendChild(lblMenuName);
    divMenuNameCntr.appendChild(inputMenuName);
    formAddPopup.appendChild(divMenuNameCntr);
    
    // Menu Short Description
    const divMenuShortDescCntr = document.createElement("div");
    const inputMenuShortDesc = document.createElement("input");
    classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
    inputMenuShortDesc.classList.add(...classes);
    inputMenuShortDesc.type = "text";
    inputMenuShortDesc.id = "input-menu-short-desc";
    const lblMenuShortDesc = document.createElement("label");
    classes = ["text-primaryColor", "font-extrabold"];
    lblMenuShortDesc.classList.add(...classes);
    lblMenuShortDesc.textContent = "Menu Short Description";
    lblMenuShortDesc.for = "input-menu-short-desc";
    divMenuShortDescCntr.appendChild(lblMenuShortDesc);
    divMenuShortDescCntr.appendChild(inputMenuShortDesc);
    formAddPopup.appendChild(divMenuShortDescCntr);

    // Menu Price
    const divMenuPriceCntr = document.createElement("div");
    const inputMenuPrice = document.createElement("input");
    classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
    inputMenuPrice.classList.add(...classes);
    inputMenuPrice.type = "text";
    inputMenuPrice.id = "input-menu-price";
    const lblMenuPrice = document.createElement("label");
    classes = ["text-primaryColor", "font-extrabold"];
    lblMenuPrice.classList.add(...classes);
    lblMenuPrice.textContent = "Menu Price";
    lblMenuPrice.for = "input-menu-price";
    divMenuPriceCntr.appendChild(lblMenuPrice);
    divMenuPriceCntr.appendChild(inputMenuPrice);
    formAddPopup.appendChild(divMenuPriceCntr);
    
    // Menu Quantity
    const divMenuQuantity = document.createElement("div");
    const inputMenuQty = document.createElement("input");
    classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
    inputMenuQty.classList.add(...classes);
    inputMenuQty.type = "text";
    inputMenuQty.id = "input-menu-quantity";
    const lblMenuQty = document.createElement("label");
    classes = ["text-primaryColor", "font-extrabold"];
    lblMenuQty.classList.add(...classes);
    lblMenuQty.textContent = "Menu Quantity";
    lblMenuQty.for = "input-menu-quantity";
    divMenuQuantity.appendChild(lblMenuQty);
    divMenuQuantity.appendChild(inputMenuQty);
    formAddPopup.appendChild(divMenuQuantity);

    // Menu Category
    const divMenuCatCntr = document.createElement("div");
    const selectMenuCat = document.createElement("select");
    classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
    selectMenuCat.classList.add(...classes);
    selectMenuCat.id = "input-menu-category";
    categories.forEach(category  => {
      console.log(category);
      selectMenuCat.add(new Option(category.code, category.id));
    });
    const lblMenuCat = document.createElement("label");
    classes = ["text-primaryColor", "font-extrabold"];
    lblMenuCat.classList.add(...classes);
    lblMenuCat.for = "input-menu-category";
    lblMenuCat.textContent = "Menu Category";
    divMenuCatCntr.appendChild(lblMenuCat);
    divMenuCatCntr.appendChild(selectMenuCat);
    formAddPopup.appendChild(divMenuCatCntr);

    // Menu Image
    const divMenuImgCntr = document.createElement("div");
    const inputMenuImg = document.createElement("input");
    classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor"];
    inputMenuImg.classList.add(...classes);
    inputMenuImg.type = "file";
    inputMenuImg.accept = ".jpg, .jpeg, .png";
    inputMenuImg.id = "input-menu-image";
    const lblMenuImg = document.createElement("label");
    classes = ["text-primaryColor", "font-extrabold"];
    lblMenuImg.classList.add(...classes);
    lblMenuImg.textContent = "Menu Image";
    lblMenuImg.for = "input-menu-image";
    divMenuImgCntr.appendChild(lblMenuImg);
    divMenuImgCntr.appendChild(inputMenuImg);
    formAddPopup.appendChild(divMenuImgCntr);

    // Menu Variant
    const divMenuVariant = document.createElement("div");
    classes = ["flex", "flex-col", "gap-[.3rem]"];
    divMenuVariant.classList.add(...classes);
    const selectMenuVariant = document.createElement("select");
    classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
    selectMenuVariant.classList.add(...classes);
    selectMenuVariant.id = "input-menu-variant";
    selectMenuVariant.add(new Option("No", "false", true, true));
    selectMenuVariant.add(new Option("Yes", "true"));
    const lblSelectMenuVariant = document.createElement("label");
    classes = ["text-primaryColor", "font-extrabold"];
    lblSelectMenuVariant.classList.add(...classes);
    lblSelectMenuVariant.textContent = "Menu Variant";
    lblSelectMenuVariant.for = "input-menu-variant";
    divMenuVariant.appendChild(lblSelectMenuVariant);
    divMenuVariant.appendChild(selectMenuVariant);
    formAddPopup.appendChild(divMenuVariant);

    const divVariantsCntr = document.createElement("div");
    classes = ["hidden", "flex-col", "gap-[.3rem]"];
    divVariantsCntr.id = "add-popup-menu-variant";
    divVariantsCntr.classList.add(...classes);
    // Add more variants
    const btnAddVariant = document.createElement("button");
    classes = ["bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "p-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
    btnAddVariant.classList.add(...classes);
    btnAddVariant.textContent = "Add variant";
    btnAddVariant.type = "button";
    divVariantsCntr.appendChild(btnAddVariant);
    formAddPopup.appendChild(divVariantsCntr);

    btnAddVariant.addEventListener("click", () => {
      const divMenuVariantDetChildCntr = document.createElement("div");
      classes = ["flex", "gap-[.3rem]", "variant-item-cntr"];
      // divMenuVariantDetChildCntr.className = "variant-item-cntr";
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
      divMenuVariantDetChildCntr.appendChild(divDeleteSvgCntr);

      const divSizeNameCtr = document.createElement("div");
      classes = ["flex-[25%]"];
      divSizeNameCtr.classList.add(...classes);
      // Size name
      const selectSizeName = document.createElement("select");
      classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
      selectSizeName.classList.add(...classes);
      selectSizeName.id = "menu-size-name";
      sizes.forEach(size => {
        selectSizeName.add(new Option(`${size.sizeName}`, size.id));
      });
      const lblSizeName = document.createElement("label");
      classes = ["text-primaryColor", "font-extrabold"];
      lblSizeName.classList.add(...classes);
      lblSizeName.textContent = "Size Name";
      lblSizeName.for = "menu-size-name";
      divSizeNameCtr.appendChild(lblSizeName);
      divSizeNameCtr.appendChild(selectSizeName);
      divMenuVariantDetChildCntr.appendChild(divSizeNameCtr);
      
      const divSizePriceCntr = document.createElement("div");
      classes = ["flex-[25%]"];
      divSizePriceCntr.classList.add(...classes);
      // Size price
      const inputSizePrice = document.createElement("input");
      classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "menu-size-price"];
      inputSizePrice.classList.add(...classes);
      inputSizePrice.type = "text";
      inputSizePrice.id = "menu-size-price";
      const lblSizePrice = document.createElement("label");
      classes = ["text-primaryColor", "font-extrabold"];
      lblSizePrice.classList.add(...classes);
      lblSizePrice.textContent = "Size Price";
      lblSizePrice.for = "menu-size-price";
      divSizePriceCntr.appendChild(lblSizePrice);
      divSizePriceCntr.appendChild(inputSizePrice); 
      divMenuVariantDetChildCntr.appendChild(divSizePriceCntr);

      const divSizeQtyCntr = document.createElement("div");
      classes = ["flex-[30%]"];
      divSizeQtyCntr.classList.add(...classes);
      // Size quantity
      const inputSizeQty = document.createElement("input");
      classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "menu-size-quantity"];
      inputSizeQty.classList.add(...classes);
      inputSizeQty.type = "text";
      inputSizeQty.id = "menu-size-quantity";
      const lblSizeQty = document.createElement("label");
      classes = ["text-primaryColor", "font-extrabold"];
      lblSizeQty.classList.add(...classes);
      lblSizeQty.textContent = "Size Quantity";
      lblSizeQty.for = "menu-size-quantity";
      divSizeQtyCntr.appendChild(lblSizeQty);
      divSizeQtyCntr.appendChild(inputSizeQty); 
      divMenuVariantDetChildCntr.appendChild(divSizeQtyCntr);
      divVariantsCntr.appendChild(divMenuVariantDetChildCntr)
      divMenuVariant.appendChild(divVariantsCntr);

      divDeleteSvgCntr.addEventListener("click", () => {
        // Since not added pa remove DOM lang
        divVariantsCntr.removeChild(divMenuVariantDetChildCntr);
        // const selectSizeNameRef = document.getElementById("menu-size-name");
        // deleteVariant(divVariantsCntr, divMenuVariantDetChildCntr, selectSizeNameRef.value);
      });
    });

    // Select tag variant functionality
    selectMenuVariant.addEventListener("change", (event) => {
      const value = (event.target.value == "true") ? true : false;

      if(value){
        divVariantsCntr.classList.add("flex");
        divVariantsCntr.classList.remove("hidden");
        inputMenuPrice.classList.add("border-errorAlert");
        inputMenuPrice.classList.remove("border-primaryColor");
        inputMenuPrice.value = "";
        inputMenuQty.classList.add("border-errorAlert");
        inputMenuQty.classList.remove("border-primaryColor");
        inputMenuQty.value = "";
      }else{
        divVariantsCntr.classList.add("hidden");
        divVariantsCntr.classList.remove("flex");
        inputMenuPrice.classList.remove("border-errorAlert");
        inputMenuPrice.classList.add("border-primaryColor");
        inputMenuQty.classList.remove("border-errorAlert");
        inputMenuQty.classList.add("border-primaryColor");
      }
    });

    // Form buttons
    const divButtonCntr = document.createElement("div");
    classes = ["col-span-full", "flex", "gap-[.3rem]"];
    divButtonCntr.classList.add(...classes);
    const btnSave = createOkButton("Save");
    btnSave.type = "button";
    divButtonCntr.appendChild(btnSave);
    const cancelBtn = createCancelBtn();
    cancelBtn.type = "button";
    divButtonCntr.appendChild(cancelBtn);
    formAddPopup.appendChild(divButtonCntr);

    divAddPopupCntr.appendChild(formAddPopup);
    divAddPopup.appendChild(divAddPopupCntr);
    body.appendChild(divAddPopup);

    btnSave.addEventListener("click", async () => {
      let variantSizes = [];
      let menuName = inputMenuName.value.trim();
      let menuShortDesc = inputMenuShortDesc.value.trim();
      let menuPrice = (inputMenuPrice.value.trim() == "") ? 0 : inputMenuPrice.value.trim();
      let menuQty = (inputMenuQty.value.trim() == "") ? 0 : inputMenuQty.value.trim();
      let menuCategoryId = selectMenuCat.value;
      let menuImg = inputMenuImg.files[0];
      let menuWithVariant = (selectMenuVariant.value == "true") ? true : false;

      if((menuName == ""|| menuShortDesc == "" || menuPrice == "" || menuQty == "" || menuCategoryId == "" || menuImg == null) && !menuWithVariant){
        alert("Please fill all missing fields");
        return;
      }

      const variantItemCntr = document.getElementById("add-popup-menu-variant");
      const variantItem = document.getElementsByClassName("variant-item-cntr");
      const variantItemPrice = variantItemCntr.getElementsByClassName("menu-size-price");
      const variantItemQty = variantItemCntr.getElementsByClassName("menu-size-quantity");
      const variantItemSelect = variantItemCntr.getElementsByTagName("select");
      
      if(selectMenuVariant.value == "true" && variantItem.length == 0){
        alert("Please include at least one variant or make it false.")
        return;
      }
      
      if(menuWithVariant){
        Array.from(variantItemPrice).forEach((item, index) => {
          if(item.value.trim() == "" || variantItemSelect[index].value.trim() == ""){
            alert("Please fill missing fields on variant options.")
            return;
          }else{
            let sizeQty = (variantItemQty[index].value.trim() == "" || variantItemQty[index].value.trim() == null) ? 0 : variantItemQty[index].value.trim(); 
            variantSizes.push(
              {
                sizeId: variantItemSelect[index].value.trim(),
                sizePrice :item.value.trim(),
                sizeQuantity: sizeQty
              }
            )
          }
        });
      }

      const foodRequest = {
        foodName: menuName,
        shortFoodDesc: menuShortDesc,
        price: menuPrice,
        quantity: menuQty,
        categoryId: menuCategoryId,
        withVariant: menuWithVariant,
        variants: variantSizes
      }

      const foodPostRequestFormData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(foodRequest)], {type: "application/json"});
      foodPostRequestFormData.append("food", jsonBlob);
      foodPostRequestFormData.append("image", menuImg);

      await foodService.postFood(foodPostRequestFormData)
        .then(response => {
          if(response.status == 200){
            const body = document.getElementById("body");

            body.removeChild(divAddPopup);

            const divAdddedPopup = document.createElement("div");
            classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryColor", "z-[3]"];
            divAdddedPopup.classList.add(...classes);

            const divAdddedPopupCntr = document.createElement("div");
            classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
            divAdddedPopupCntr.classList.add(...classes);

            const h1Title = document.createElement("h1");
            classes = ["text-3xl", "font-extrabold"];
            h1Title.classList.add(...classes);
            h1Title.textContent = "Added successfully!";
            divAdddedPopupCntr.appendChild(h1Title);

            // Food name
            const spanFoodName = document.createElement("span");
            spanFoodName.textContent = "Food name: " + response.data.foodName;
            divAdddedPopupCntr.appendChild(spanFoodName);

            // Short Food name Description
            const spanShortFoodDesc = document.createElement("span");
            spanShortFoodDesc.textContent = "Short Description: " + response.data.shortFoodDesc;
            divAdddedPopupCntr.appendChild(spanShortFoodDesc);

            const okBtn = createOkButton();
            okBtn.type = "button";
            divAdddedPopupCntr.appendChild(okBtn);

            divAdddedPopup.appendChild(divAdddedPopupCntr);
            body.appendChild(divAdddedPopup);

            okBtn.addEventListener("click", () => {
              window.location.reload();
            });
          }
        })
        .catch(error => {
          console.error("There was a during adding of food.");
        });
    });

    cancelBtn.addEventListener("click", () => {
      body.removeChild(divAddPopup);
    });
  });
  divFRTS.appendChild(btnAddMenu);

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
    btn.textContent = `${category.code}`;
    classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
    btn.classList.add(...classes);
    btn.id = category.code.toLowerCase().replace(/ /g, "-");

    btn.addEventListener("click", async () => {    
      moveActiveBtn(btn);

      const url = new URL(window.location.href);
      url.searchParams.set("category", category.code);
      window.history.pushState({}, "", url);

      await foodService.getMenuListByCategory(category.id)
        .then(response => {
          if(response.status == 200)
            displayMenuList(response.data);
        })
        .catch(error => {
          console.error("ERROR: " + error);
        });
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
      menuList.forEach(async element => {
        const inventory = element.inventory;

        const divMenuCntr = document.createElement("div");
        classes = ["flex", "flex-col", "h-[100%]", "gap-[.5rem]", "relative", "bg-primaryBg", "p-2", "rounded-sm"];
        divMenuCntr.classList.add(...classes);
        
        // Image
        const img = document.createElement("img");
        let imageURL;
        await foodService.getImage(element.id)
        .then(response => {
          if(response.status == 200 || response.status == 201){
              imageURL = URL.createObjectURL(response.data);

              img.src = imageURL;
            }
          })
          .catch(error => {
            console.error("Unable to load image: " + error);
            img.src = "/sample_img.jpg";
          });
        img.style.width = "100%";
        img.style.height = "130px";
        classes = ["rounded-sm"];
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
        spanName.textContent = element.foodName;
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
        classes = ["flex", "flex-col", "gap-[.3rem]", "h-[100%]", "items-end"];
        actionBtnCntr.classList.add(...classes);
        const actionBtn = document.createElement("button");
        actionBtn.textContent = "Edit";
        classes = ["w-full", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
        actionBtn.classList.add(...classes);
        actionBtn.addEventListener("click", async () => {

          const url = new URL(window.location.href);
          url.searchParams.set("foodId", element.id);
          window.history.pushState({}, "", url);

          const body = document.getElementById("body")

          const divEditPopup = document.createElement("div");
          classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
          divEditPopup.classList.add(...classes);

          const divEditPopupCntr = document.createElement("div");
          classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
          divEditPopupCntr.classList.add(...classes);

          const spanEditTitle = document.createElement("span");
          classes = ["text-3xl", "font-extrabold", "text-primaryColor"];
          spanEditTitle.classList.add(...classes);
          spanEditTitle.textContent = "Edit food";
          divEditPopupCntr.appendChild(spanEditTitle);

          const formMenuDetails = document.createElement("form");     
          classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
          formMenuDetails.classList.add(...classes);
          
          // Menu name
          const divMenuNameCntr = document.createElement("div");
          const inputMenuName = document.createElement("input");
          classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "outer"];
          inputMenuName.classList.add(...classes);
          inputMenuName.id = "menu-name";
          inputMenuName.name = "name";
          inputMenuName.type = "text";
          inputMenuName.value = element.foodName;
          inputMenuName.defaultValue = element.foodName;
          const lblMenuName = document.createElement("label");
          classes = ["text-primaryColor", "font-extrabold"];
          lblMenuName.classList.add(...classes);
          lblMenuName.for = "menu-name";
          lblMenuName.textContent = "Menu Name";
          divMenuNameCntr.appendChild(lblMenuName);
          divMenuNameCntr.appendChild(inputMenuName);
          formMenuDetails.appendChild(divMenuNameCntr);
          
          const divMenuShortDesc = document.createElement("div");
          const inputMenuShortDesc = document.createElement("input");
          classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "outer"];
          inputMenuShortDesc.classList.add(...classes);
          inputMenuShortDesc.id = "menu-short-desc";
          inputMenuShortDesc.type = "text";
          inputMenuShortDesc.name = "shortDesc";
          inputMenuShortDesc.value = element.shortFoodDesc;
          inputMenuShortDesc.defaultValue = element.shortFoodDesc;
          const lblMenuShortDesc = document.createElement("label");
          classes = ["text-primaryColor", "font-extrabold"];
          lblMenuShortDesc.classList.add(...classes);
          lblMenuShortDesc.for = "menu-short-desc";
          lblMenuShortDesc.textContent = "Menu Short Desc.";
          divMenuShortDesc.appendChild(lblMenuShortDesc);
          divMenuShortDesc.appendChild(inputMenuShortDesc);
          formMenuDetails.appendChild(divMenuShortDesc);
          
          // Menu price
          const divMenuPriceCntr = document.createElement("div");
          const inputMenuPrice = document.createElement("input");
          classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "outer"];
          inputMenuPrice.classList.add(...classes);
          inputMenuPrice.id = "menu-price";
          inputMenuPrice.name = "price";
          inputMenuPrice.type = "text";
          if(!element.withVariant){
            inputMenuPrice.value = element.price;
            inputMenuPrice.defaultValue = element.price;
          }
          const lblMenuPrice = document.createElement("label");
          classes = ["text-primaryColor", "font-extrabold"];
          lblMenuPrice.classList.add(...classes);
          lblMenuPrice.for = "menu-price";
          lblMenuPrice.textContent = "Menu Price";
          divMenuPriceCntr.appendChild(lblMenuPrice);
          divMenuPriceCntr.appendChild(inputMenuPrice);
          formMenuDetails.appendChild(divMenuPriceCntr);

          // Menu Quantity
          const divMenuQty = document.createElement("div");
          const inputMenuQty = document.createElement("input");
          classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "outer"];
          inputMenuQty.classList.add(...classes);
          inputMenuQty.id = "menu-quantity";
          inputMenuQty.name = "quantity";
          inputMenuQty.type = "text";
          if(!element.withVariant){
            inputMenuQty.value = element.quantity;
            inputMenuQty.defaultValue = element.quantity;
          }
          const lblMenuQty = document.createElement("label");
          classes = ["text-primaryColor", "font-extrabold"];
          lblMenuQty.classList.add(...classes);
          lblMenuQty.for = "menu-quantity";
          lblMenuQty.textContent = "Menu Quantity";
          divMenuQty.appendChild(lblMenuQty);
          divMenuQty.appendChild(inputMenuQty);
          formMenuDetails.appendChild(divMenuQty);

          // Menu category
          const divMenuCatCntr = document.createElement("div");
          const selectMenuCat = document.createElement("select");
          classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
          selectMenuCat.classList.add(...classes);
          selectMenuCat.id = "menu-category";
          selectMenuCat.name = "category";
          categories.forEach(category  => {
            if(element.category.id == category.id){
              selectMenuCat.add(new Option(category.code, category.id, true, true));
            }else{
              selectMenuCat.add(new Option(category.code, category.id));
            }
          });
          const lblMenuCat = document.createElement("label");
          classes = ["text-primaryColor", "font-extrabold"];
          lblMenuCat.classList.add(...classes);
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
            divMenuVariantDetChildCntr.className = "variant-item-cntr";
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
              deleteVariant(divMenuVariantDetCntr, divMenuVariantDetChildCntr, variant.productVariant.size.id);
            });
            divMenuVariantDetChildCntr.appendChild(divDeleteSvgCntr);

            const divSizeNameCtr = document.createElement("div");
            classes = ["flex-[25%]"];
            divSizeNameCtr.classList.add(...classes);
            // Size name
            const selectSizeName = document.createElement("select");
            classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
            selectSizeName.classList.add(...classes);
            selectSizeName.id = "menu-size-name";
            sizes.forEach(size => {
              selectSizeName.add(new Option(`${size.sizeName}`, size.id));
            });
            const lblSizeName = document.createElement("label");
            classes = ["text-primaryColor", "font-extrabold"];
            lblSizeName.classList.add(...classes);
            lblSizeName.textContent = "Size Name";
            lblSizeName.for = "menu-size-name";
            divSizeNameCtr.appendChild(lblSizeName);
            divSizeNameCtr.appendChild(selectSizeName);
            divMenuVariantDetChildCntr.appendChild(divSizeNameCtr);
            
            const divSizePriceCntr = document.createElement("div");
            classes = ["flex-[25%]"];
            divSizePriceCntr.classList.add(...classes);
            // Size price
            const inputSizePrice = document.createElement("input");
            classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "menu-size-price"];
            inputSizePrice.classList.add(...classes);
            inputSizePrice.type = "text";
            inputSizePrice.id = "menu-size-price";
            inputSizePrice.name = "sizePrice";
            const lblSizePrice = document.createElement("label");
            classes = ["text-primaryColor", "font-extrabold"];
            lblSizePrice.classList.add(...classes);
            lblSizePrice.textContent = "Size Price";
            lblSizePrice.for = "menu-size-price";
            divSizePriceCntr.appendChild(lblSizePrice);
            divSizePriceCntr.appendChild(inputSizePrice); 
            divMenuVariantDetChildCntr.appendChild(divSizePriceCntr);
            // divMenuVariantDetCntr.appendChild(divMenuVariantDetChildCntr)

            const divSizeQtyCntr = document.createElement("div");
            classes = ["flex-[30%]"];
            divSizeQtyCntr.classList.add(...classes);
            // Size quantity
            const inputSizeQty = document.createElement("input");
            classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "menu-size-quantity"];
            inputSizeQty.classList.add(...classes);
            inputSizeQty.type = "text";
            inputSizeQty.id = "menu-size-quantity";
            inputSizeQty.name = "sizeQuantity";
            const lblSizeQty = document.createElement("label");
            classes = ["text-primaryColor", "font-extrabold"];
            lblSizeQty.classList.add(...classes);
            lblSizeQty.textContent = "Size Quantity";
            lblSizeQty.for = "menu-size-quantity";
            divSizeQtyCntr.appendChild(lblSizeQty);
            divSizeQtyCntr.appendChild(inputSizeQty); 
            divMenuVariantDetChildCntr.appendChild(divSizeQtyCntr);
            divMenuVariantDetCntr.appendChild(divMenuVariantDetChildCntr)
            divMenuVariantCntr.appendChild(divMenuVariantDetCntr);
          });

          // Variant Details
          inventory?.forEach(variant => {
            const divMenuVariantDetChildCntr = document.createElement("div");
            classes = ["flex", "gap-[.3rem]"];
            divMenuVariantDetChildCntr.className = "variant-item-cntr";
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
              deleteVariant(divMenuVariantDetCntr, divMenuVariantDetChildCntr, variant.productVariant.size.id);
            });
            divMenuVariantDetChildCntr.appendChild(divDeleteSvgCntr);

            const divSizeNameCtr = document.createElement("div");
            classes = ["flex-[25%]"];
            divSizeNameCtr.classList.add(...classes);
            // Size name
            const selectSizeName = document.createElement("select");
            classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "menu-size-name"];
            selectSizeName.classList.add(...classes);
            selectSizeName.id = "menu-size-name " + variant.productVariant.size.sizeName;
            selectSizeName.setAttribute("data-old-value", variant.productVariant.size.id);
            sizes.forEach(size => {
              if(variant.productVariant.size.id == size.id)
                selectSizeName.add(new Option(`${size.sizeName}`, size.id, true, true));
              else
                selectSizeName.add(new Option(`${size.sizeName}`, size.id));
            });
            const lblSizeName = document.createElement("label");

            classes = ["text-primaryColor", "font-extrabold"];
            lblSizeName.classList.add(...classes);
            lblSizeName.textContent = "Size Name";
            lblSizeName.for = "menu-size-name " + variant.productVariant.size.sizeName;
            divSizeNameCtr.appendChild(lblSizeName);
            divSizeNameCtr.appendChild(selectSizeName);
            divMenuVariantDetChildCntr.appendChild(divSizeNameCtr);
            
            const divSizePriceCntr = document.createElement("div");
            classes = ["flex-[25%]"];
            divSizePriceCntr.classList.add(...classes);
            // Size price
            const inputSizePrice = document.createElement("input");
            classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "menu-size-price"];
            inputSizePrice.classList.add(...classes);
            inputSizePrice.type = "text";
            inputSizePrice.id = "menu-size-price " + variant.productVariant.size.sizeName;
            inputSizePrice.value = variant.productVariant.price;
            inputSizePrice.defaultValue = variant.productVariant.price;
            inputSizePrice.name = "sizePrice";
            const lblSizePrice = document.createElement("label");
            classes = ["text-primaryColor", "font-extrabold"];
            lblSizePrice.classList.add(...classes);
            lblSizePrice.textContent = "Size Price";
            lblSizePrice.for = "menu-size-price " + variant.productVariant.size.sizeName;
            divSizePriceCntr.appendChild(lblSizePrice);
            divSizePriceCntr.appendChild(inputSizePrice); 
            divMenuVariantDetChildCntr.appendChild(divSizePriceCntr);

            const divSizeQtyCntr = document.createElement("div");
            classes = ["flex-[30%]"];
            divSizeQtyCntr.classList.add(...classes);
            // Size quantity
            const inputSizeQty = document.createElement("input");
            classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "menu-size-quantity"];
            inputSizeQty.classList.add(...classes);
            inputSizeQty.type = "text";
            inputSizeQty.id = "menu-size-quantity";
            inputSizeQty.value = variant.quantity;
            inputSizeQty.defaultValue = variant.quantity;
            inputSizeQty.name = "sizeQuantity";
            const lblSizeQty = document.createElement("label");
            classes = ["text-primaryColor", "font-extrabold"];
            lblSizeQty.classList.add(...classes);
            lblSizeQty.textContent = "Size Quantity";
            lblSizeQty.for = "menu-size-quantity";
            divSizeQtyCntr.appendChild(lblSizeQty);
            divSizeQtyCntr.appendChild(inputSizeQty); 
            divMenuVariantDetChildCntr.appendChild(divSizeQtyCntr);
            divMenuVariantDetCntr.appendChild(divMenuVariantDetChildCntr)
            divMenuVariantCntr.appendChild(divMenuVariantDetCntr);
            
            divMenuVariantDetCntr.appendChild(divMenuVariantDetChildCntr);
          });
          
          classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
          selectMenuVariant.classList.add(...classes);
          selectMenuVariant.id = "menu-variant";
          selectMenuVariant.name = "withVariant";
          const lblMenuVariant = document.createElement("label");
          classes = ["text-primaryColor", "font-extrabold"];
          lblMenuVariant.classList.add(...classes);
          lblMenuVariant.for = "menu-variant";
          lblMenuVariant.textContent = "Menu Variant";
          divMenuVariantCntr.appendChild(lblMenuVariant);
          divMenuVariantCntr.appendChild(selectMenuVariant);
          divMenuVariantCntr.appendChild(divMenuVariantDetCntr);
          
          selectMenuVariant.addEventListener("change", (event) => {
            let value = event.target.value;
            inputMenuPrice.disabled = value == "true";
            inputMenuQty.disabled = value == "true";

            if(value == "true"){
              inputMenuPrice.classList.add("border-errorAlert");
              inputMenuPrice.classList.remove("border-primaryColor");
              inputMenuPrice.value = "";
              inputMenuQty.classList.add("border-errorAlert");
              inputMenuQty.classList.remove("border-primaryColor");
              inputMenuQty.value = "";
              divMenuVariantDetCntr.classList.add("flex");
              divMenuVariantDetCntr.classList.remove("hidden");
            }else{
              inputMenuPrice.classList.remove("border-errorAlert");
              inputMenuPrice.classList.add("border-primaryColor");
              inputMenuQty.classList.remove("border-errorAlert");
              inputMenuQty.classList.add("border-primaryColor");
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

          const btnOk = createOkButton("Update");
          btnOk.type = "button";
          divBtnCntr.appendChild(btnOk);

          const btnCancel = createCancelBtn();
          btnCancel.type = "button";
          divBtnCntr.appendChild(btnCancel);

          formMenuDetails.appendChild(divBtnCntr);
          divEditPopupCntr.appendChild(formMenuDetails);
          divEditPopup.appendChild(divEditPopupCntr);
          body.appendChild(divEditPopup);

          let variantSizes = [];
          btnOk.addEventListener("click", async () => {
            let isValid = true;
            let editName = (inputMenuName.value.trim() == "" || inputMenuName.value.trim() == null) ? "" : inputMenuName.value.trim();
            let editPrice = (inputMenuPrice.value.trim() == "" || inputMenuPrice.value.trim() == null) ? 0 : inputMenuPrice.value.trim();
            let editShortDesc = (inputMenuShortDesc.value.trim() == "" || inputMenuShortDesc.value.trim() == null) ? "" : inputMenuShortDesc.value.trim();
            let editQty = (inputMenuQty.value.trim() == "" || inputMenuQty.value.trim() == null) ? 0 : inputMenuQty.value.trim();
            let withVariant = (selectMenuVariant.value == "true") ? true : false;
            let category = selectMenuCat.value;
            
            const foodPatchRequest = {};
            
            // Checks for any dirty input
            const formInputs = formMenuDetails.querySelectorAll("input.outer");
            formInputs.forEach(element => {
              if(element.value.trim() !== element.defaultValue){
                foodPatchRequest[element.name] = element.value;    
              }
            });
            
            // Checks for any dirty select
            const selectMenuCategoryRef = document.getElementById("menu-category");
            const selectedValueCategory = selectMenuCategoryRef.options[selectMenuCategoryRef.selectedIndex];
            let categoryValue = {};
            if(!selectedValueCategory.defaultSelected){
              categoryValue = {
                id: selectedValueCategory.value,
                code: selectedValueCategory.textContent
                // foodPatchRequest[selectMenuCategoryRef.name] = selectedValueCategory.value;
              };

              foodPatchRequest['category'] = categoryValue;
            }
            
            // Checks for any dirty select
            const selectMenuVariantRef = document.getElementById("menu-variant");
            const selectedValueVariant = selectMenuVariantRef.options[selectMenuVariantRef.selectedIndex];
            if(!selectedValueVariant.defaultSelected)
              foodPatchRequest[selectMenuVariantRef.name] = selectedValueVariant.value;

            
            if((editName == ""|| editPrice == "" || editShortDesc == "" || editQty == "" || category == "") && !withVariant){
              alert("Please fill all missing fields");
              return;
            }

            const variantItemCntr = document.getElementById("edit-popup-menu-variant");
            const variantItem = document.getElementsByClassName("variant-item-cntr");
            const variantItemPrice = variantItemCntr.getElementsByClassName("menu-size-price");
            const variantItemQty = variantItemCntr.getElementsByClassName("menu-size-quantity");
            const variantItemSelect = variantItemCntr.getElementsByTagName("select");
            
            if(selectMenuVariant.value == "true" && variantItem.length == 0){
              alert("Please include at least one variant or make it false.")
              return;
            }
            
            Array.from(variantItemPrice).forEach((item, index) => {
              if(item.value.trim() == "" || variantItemSelect[index].value.trim() == ""){
                alert("Please fill missing fields on variant options.")
                isValid = false;
                return;
              }else{
                let isChanged = false;
                let sizeQty = 0;
                let variantJson = {};

                if(variantItemQty[index].value.trim() !== variantItemQty[index].defaultValue){
                  sizeQty = (variantItemQty[index].value.trim() == "" || variantItemQty[index].value.trim() == null) ? 0 : variantItemQty[index].value.trim(); 
                  variantJson[variantItemQty[index].name] = sizeQty;
                  isChanged = true;
                }

                if(item.value.trim() !== item.defaultValue){
                  variantJson[item.name] = item.value.trim();
                  isChanged = true;
                }

                const selectedSize = variantItemSelect[index].options[variantItemSelect[index].selectedIndex];
                if(selectedSize.value !== variantItemSelect[index].getAttribute("data-old-value"))
                  isChanged = true;
                
                if(isChanged){
                  variantJson["sizeId"] = variantItemSelect[index].value;
                  variantJson["sizeOldId"] = variantItemSelect[index].getAttribute("data-old-value");
                  variantSizes.push(
                    variantJson 
                  );
                }
              }
            });

            if(variantSizes.length > 0)
              foodPatchRequest["variants"] = variantSizes;
            
            if(isValid){
              console.log(foodPatchRequest);

              const urlChecker = new URL(window.location.href);
              const searchFoodIdValue = urlChecker.searchParams.get("foodId");
              if(foodPatchRequest.constructor === Object && Object.keys(foodPatchRequest).length > 0 && (searchFoodIdValue != null || searchFoodIdValue != "")){
                await foodService.patchFoodById(searchFoodIdValue, foodPatchRequest)
                  .then(response => {
                    if(response.status == 200){
                      const body = document.getElementById("body");
  
                      body.removeChild(divEditPopup);
  
                      const divEditedPopup = document.createElement("div");
                      classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryColor", "z-[3]"];
                      divEditedPopup.classList.add(...classes);
  
                      const divEditedPopupCntr = document.createElement("div");
                      classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
                      divEditedPopupCntr.classList.add(...classes);
  
                      const h1Title = document.createElement("h1");
                      classes = ["text-3xl", "font-extrabold"];
                      h1Title.classList.add(...classes);
                      h1Title.textContent = "Edited successfully!";
                      divEditedPopupCntr.appendChild(h1Title);
                      
                      const okBtn = createOkButton();
                      okBtn.type = "button";
                      divEditedPopupCntr.appendChild(okBtn);

                      divEditedPopup.appendChild(divEditedPopupCntr);
                      body.appendChild(divEditedPopup);

                      okBtn.addEventListener("click", () => {
                        window.location.reload();
                      });
                    }
                  })
                  .catch(error => {
                    console.error("Cannot perform update. " + error);
                  });
              }else{
                alert("No field to update.");
              }
            }
          });
          
          btnCancel.addEventListener("click", () => {
            removeParams();
            // window.location.reload();
            body.removeChild(divEditPopup);
          });
        });
        actionBtnCntr.appendChild(actionBtn);

        divMenuCntr.appendChild(img);
        divMenuCntr.appendChild(spanStatus);
        divMenuCntr.appendChild(divNameNPriceCntr);
        divMenuCntr.appendChild(divInventoryCntr);
        
        const btnDeleteFood = document.createElement("button");
        classes = ["w-full", "bg-errorAlert", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-errorAlert/50"];
        btnDeleteFood.classList.add(...classes);
        btnDeleteFood.textContent = "Delete";
        actionBtnCntr.appendChild(btnDeleteFood);
        divMenuCntr.appendChild(actionBtnCntr);

        btnDeleteFood.addEventListener("click", () => {
          const url = new URL(window.location.href);
          url.searchParams.set("foodId", element.id);
          window.history.pushState({}, "", url);

          const divDeleteConfirmationPopup = document.createElement("div");
          classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
          divDeleteConfirmationPopup.classList.add(...classes);
          
          const divDeleteConfirmationPopupCntr = document.createElement("div");
          classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
          divDeleteConfirmationPopupCntr.classList.add(...classes);
          
          const spanDeleteCaption = document.createElement("span");
          classes = ["text-3xl", "font-extrabold", "text-primaryColor"];
          spanDeleteCaption.classList.add(...classes);
          spanDeleteCaption.textContent = "Are you sure you want to delete this?";
          divDeleteConfirmationPopupCntr.appendChild(spanDeleteCaption);

          const divDeleteBtnCntr = document.createElement("div");
          classes = ["flex", "gap-[.3rem]"];
          divDeleteBtnCntr.classList.add(...classes);
          const btnOk = createOkButton();
          btnOk.type = "button";
          divDeleteBtnCntr.appendChild(btnOk);
          const btnCancel = createCancelBtn();
          btnCancel.type = "button";
          divDeleteBtnCntr.appendChild(btnCancel);
          divDeleteConfirmationPopupCntr.appendChild(divDeleteBtnCntr);
          
          divDeleteConfirmationPopup.appendChild(divDeleteConfirmationPopupCntr);
          body.appendChild(divDeleteConfirmationPopup);

          btnOk.addEventListener("click", async () => {
            const urlChecker = new URL(window.location.href);
            const foodIdValue = urlChecker.searchParams.get("foodId");

            if(foodIdValue != null){
              await foodService.deleteFood(foodIdValue)
                .then(response => {
                  if(response.status == 204){
                    const body = document.getElementById("body");
  
                    body.removeChild(divDeleteConfirmationPopup);

                    const divDeletePopup = document.createElement("div");
                    classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryColor", "z-[3]"];
                    divDeletePopup.classList.add(...classes);

                    const divDeletePopupCntr = document.createElement("div");
                    classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
                    divDeletePopupCntr.classList.add(...classes);

                    const h1Title = document.createElement("h1");
                    classes = ["text-3xl", "font-extrabold"];
                    h1Title.classList.add(...classes);
                    h1Title.textContent = "Deleted successfully!";
                    divDeletePopupCntr.appendChild(h1Title);
                    
                    const okBtn = createOkButton();
                    okBtn.type = "button";
                    divDeletePopupCntr.appendChild(okBtn);

                    divDeletePopup.appendChild(divDeletePopupCntr);
                    body.appendChild(divDeletePopup);

                    okBtn.addEventListener("click", () => {
                      window.location.reload();
                    });
                  }
                })
                .catch(error => {
                  console.error("There was a problem during deletion of food " + error);
                });
            }else{
              alert("There was a problem. Cannot perform deletion");
            }
          });

          btnCancel.addEventListener("click", () => {
            body.removeChild(divDeleteConfirmationPopup);
          });
        });

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

  function deleteVariant(pMenuVariantParent, pMenuVariantChild, sizeId){
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

    const url = new URL(window.location.href);
    url.searchParams.set("sizeId", sizeId);
    window.history.pushState({}, "", url);

    btnOk.addEventListener("click", async () => {
      const urlChecker = new URL(window.location.href);
      const searchFoodIdValue = urlChecker.searchParams.get("foodId");
      const searchSizeIdValue = urlChecker.searchParams.get("sizeId");

      if(searchFoodIdValue != null && searchSizeIdValue != null){
        await foodService.deleteVariant(searchFoodIdValue, searchSizeIdValue)
          .then(response => {
            if(response.status == 204){
              pMenuVariantParent.removeChild(pMenuVariantChild);
              body.removeChild(divConfirmationPopup);
            }
          })
          .catch(error => {
            console.error("There was a during adding of food.");
          });
      }else{
        alert("Please fill missing fields");
      }
    });
    
    btnCancel.addEventListener("click", () => {
      body.removeChild(divConfirmationPopup);
    });
  }
}