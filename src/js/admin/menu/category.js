import { categoryService } from "../../services/categoryservice";
import { createCancelBtn, createInputText, createLabel, createOkButton, removeParams } from "../../utilities";

export async function renderCategory(container){
  sessionStorage.setItem("active-tab", "category");
  
  let classes = [];

  const section = document.createElement("section");
  classes = ["flex", "flex-col", "bg-secondaryBg", "h-full", "min-h-0"];
  section.classList.add(...classes);
  section.id = "category-container";

  // First Row
  const divFirstRow = document.createElement("div");
  classes = ["flex-1", "flex", "flex-col", "gap-[.6rem]", "border-b-1", "border-borderColor", "p-3"];
  divFirstRow.classList.add(...classes);

  // First Row Top Side
  const divFRTS = document.createElement("div");
  divFRTS.id = "first-row-top-side";
  classes = ["flex", "gap-2"];
  divFRTS.classList.add(...classes);

  const btnAddCategory = document.createElement("button");
  btnAddCategory.textContent = "ADD CATEGORY";
  classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
  btnAddCategory.classList.add(...classes);
  btnAddCategory.addEventListener("click", () => {
    const body = document.getElementById("body")

    const divAddPopup = document.createElement("div");
    classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
    divAddPopup.classList.add(...classes);

    const divAddPopupCntr = document.createElement("div");
    classes = ["flex", "flex-col", "gap-[.6rem]", "w-[35.5%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
    divAddPopupCntr.classList.add(...classes);

    const spanAddTitle = document.createElement("span");
    classes = ["text-3xl", "font-extrabold", "text-primaryColor"];
    spanAddTitle.classList.add(...classes);
    spanAddTitle.textContent = "Add Category";
    divAddPopupCntr.appendChild(spanAddTitle);

    const formAddCategory = document.createElement("form");
    classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
    formAddCategory.classList.add(...classes);

    const divCode = document.createElement("div");
    const inputCode = createInputText();
    inputCode.id = "code";
    const lblCode = createLabel("Code");
    divCode.appendChild(lblCode);
    divCode.appendChild(inputCode);
    formAddCategory.appendChild(divCode);

    const divBtnCntr = document.createElement("div");
    classes = ["col-span-full", "flex", "gap-[.3rem]"];
    divBtnCntr.classList.add(...classes);

    const saveBtn = createOkButton("Save");
    saveBtn.type = "button";
    divBtnCntr.appendChild(saveBtn);

    const cancelBtn = createCancelBtn("Cancel");
    cancelBtn.type = "button";
    divBtnCntr.appendChild(cancelBtn);
    formAddCategory.appendChild(divBtnCntr);

    divAddPopupCntr.appendChild(formAddCategory);
    divAddPopup.appendChild(divAddPopupCntr);
    body.appendChild(divAddPopup);

    saveBtn.addEventListener("click", async () => {
      const code = inputCode.value.trim();

      if(code == ""){
        alert("Please fill missing fields");
        return;
      }

      const postRequest = {
        code: code
      };

      await categoryService.postCategory(postRequest)
        .then(response => {
          if(response.status == 200){
            const body = document.getElementById("body");
  
            body.removeChild(divAddPopup);

            const divAddedPopup = document.createElement("div");
            classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryColor", "z-[3]"];
            divAddedPopup.classList.add(...classes);

            const divAddedPopupCntr = document.createElement("div");
            classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
            divAddedPopupCntr.classList.add(...classes);

            const h1Title = document.createElement("h1");
            classes = ["text-3xl", "font-extrabold"];
            h1Title.classList.add(...classes);
            h1Title.textContent = "Added successfully!";
            divAddedPopupCntr.appendChild(h1Title);
            
            const okBtn = createOkButton();
            okBtn.type = "button";
            divAddedPopupCntr.appendChild(okBtn);

            divAddedPopup.appendChild(divAddedPopupCntr);
            body.appendChild(divAddedPopup);

            okBtn.addEventListener("click", () => {
              window.location.reload();
            });
          }else
            console.error("Unhandled status code: ", response.status);
        })
        .catch(error => {
          console.log("There was a problem adding of category: " + error);
        });
    });

    cancelBtn.addEventListener("click", () => {
      body.removeChild(divAddPopup);
    });
  });
  divFRTS.appendChild(btnAddCategory);
  divFirstRow.appendChild(divFRTS);
  section.appendChild(divFirstRow);
  container.appendChild(section);

  let categories = [];
  await categoryService.getCategories()
    .then(response => {
      if(response.status == 200)
        categories = response.data;
      else
        console.error("Unhandled status code: " + response.status);
    })
    .catch(error => {
      console.error("There was a problem fetching categories:" + error);
    });

  // Category displaying
  const divSecondRow = document.createElement("div");
  classes = ["flex-16", "p-3", "flex", "gap-[.5rem]", "min-h-0"];
  divSecondRow.classList.add(...classes);  

  const divCategory = document.createElement("div");
  classes = ["flex-3", "grid", "grid-cols-7", "gap-3", "h-max"];
  divCategory.classList.add(...classes);
  console.log(categories);
  if(categories.length == 0){
    const divCategoryCntr = document.createElement("div");
    classes = ["flex", "flex-col", "p-3", "text-primaryColor", "gap-[.3rem]", "rounded-md"];
    divCategoryCntr.classList.add(...classes);

    const spanEmptyRecord = document.createElement("span");
    classes = ["font-extrabold"];
    spanEmptyRecord.classList.add(...classes);
    spanEmptyRecord.textContent = "No record found!";
    divCategoryCntr.appendChild(spanEmptyRecord);
    divSecondRow.appendChild(divCategoryCntr);
  }else{
    categories.forEach(category => {
      const divCategoryCntr = document.createElement("div");
      classes = ["flex", "flex-col", "p-3", "text-primaryColor", "bg-primaryBg", "gap-[.3rem]", "rounded-md"];
      divCategoryCntr.classList.add(...classes);
  
      const spanCategoryCode = document.createElement("span");
      classes = ["font-extrabold"];
      spanCategoryCode.classList.add(...classes);
      spanCategoryCode.textContent = `Code: ${category.code}`;
      divCategoryCntr.appendChild(spanCategoryCode);
  
      const actionsBtnCntr = document.createElement("div");
      classes = ["flex", "flex-col", "gap-[.3rem]", "h-[100%]", "justify-end"];
      actionsBtnCntr.classList.add(...classes);
      const editBtn = createOkButton("Edit");
      editBtn.type = "button";
      actionsBtnCntr.appendChild(editBtn);
      editBtn.addEventListener("click", () => {
        const url = new URL(window.location.href);
        url.searchParams.set("code", category.code);
        window.history.pushState({}, "", url);
  
        const body = document.getElementById("body")
  
        const divEditPopup = document.createElement("div");
        classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
        divEditPopup.classList.add(...classes);
  
        const divEditPopupCntr = document.createElement("div");
        classes = ["flex", "flex-col", "gap-[.6rem]", "w-[35.5%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
        divEditPopupCntr.classList.add(...classes);
  
        const spanEditTitle = document.createElement("span");
        classes = ["text-3xl", "font-extrabold", "text-primaryColor"];
        spanEditTitle.classList.add(...classes);
        spanEditTitle.textContent = `Edit Category: ${category.code}`;
        divEditPopupCntr.appendChild(spanEditTitle);
  
        const formCategoryDetails = document.createElement("form");
        classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
        formCategoryDetails.classList.add(...classes);
  
        const divCode = document.createElement("div");
        const inputCode = createInputText();
        inputCode.id = "code";
        inputCode.value = category.code;
        inputCode.defaultValue = category.code;
        const lblCode = createLabel("Code");
        divCode.appendChild(lblCode);
        divCode.appendChild(inputCode);
        formCategoryDetails.appendChild(divCode);
  
        const divBtnCntr = document.createElement("div");
        classes = ["col-span-full", "flex", "gap-[.3rem]"];
        divBtnCntr.classList.add(...classes);
  
        const updateBtn = createOkButton("Update");
        updateBtn.type = "button";
        divBtnCntr.appendChild(updateBtn);
  
        const cancelBtn = createCancelBtn("Cancel");
        cancelBtn.type = "button";
        divBtnCntr.appendChild(cancelBtn);
        formCategoryDetails.appendChild(divBtnCntr);
  
        divEditPopupCntr.appendChild(formCategoryDetails);
        divEditPopup.appendChild(divEditPopupCntr);
        body.appendChild(divEditPopup);
  
        updateBtn.addEventListener("click", async () => {
          let isValid = true;
          const code = inputCode.value.trim();
  
          if(code == ""){
            alert("Please fill missing fields");
            return;
          }
  
          if(code === inputCode.defaultValue)
            isValid = false;
  
          if(isValid){
            const patchRequest = {
              id: category.id,
              code: code,
            };
            
            await categoryService.patchCategory(patchRequest, category.id)
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
                }else{
                  console.error("Unhandled status code: " + response.status);
                }
              })
          }else
            alert("No fields to update");
        });
  
        cancelBtn.addEventListener("click", () => {
          removeParams();
          body.removeChild(divEditPopup);
        });
      });
      
      const deleteBtn = createCancelBtn("Delete");
      deleteBtn.type = "button";
      actionsBtnCntr.appendChild(deleteBtn);
      deleteBtn.addEventListener("click", () => {
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
        url.searchParams.set("category", category.code);
        window.history.pushState({}, "", url);

        btnOk.addEventListener("click", async () => {
          await categoryService.deleteCategory(category.id)
            .then(response => {
              if(response.status == 204){
                const body = document.getElementById("body");
  
                body.removeChild(divConfirmationPopup);

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
              console.error("Unable to perform deletion: " + error);
            });
        });

        btnCancel.addEventListener("click", () => {
          body.removeChild(divConfirmationPopup);
        });
      });
  
      divCategoryCntr.appendChild(actionsBtnCntr);
      divCategory.appendChild(divCategoryCntr);
      divSecondRow.appendChild(divCategory);
    });
  }

  section.appendChild(divSecondRow);
  container.appendChild(section);
}