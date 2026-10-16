import { sizeService } from "../../services/sizeService";
import { createCancelBtn, createOkButton } from "../../utilities";

export async function renderVariant(container){
  sessionStorage.setItem("active-tab", "variant");
  
  let classes = [];

  const section = document.createElement("section");
  classes = ["flex", "flex-col", "bg-secondaryBg", "h-full", "min-h-0"];
  section.classList.add(...classes);
  section.id = "variant-container";

  // First Row
  const divFirstRow = document.createElement("div");
  classes = ["flex-1", "flex", "flex-col", "gap-[.6rem]", "border-b-1", "border-borderColor", "p-3"];
  divFirstRow.classList.add(...classes);

  // First Row Top Side
  const divFRTS = document.createElement("div");
  divFRTS.id = "first-row-top-side";
  classes = ["flex", "gap-2"];
  divFRTS.classList.add(...classes);

  const btnAddVariant = document.createElement("button");
  btnAddVariant.textContent = "ADD VARIANT";
  classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
  btnAddVariant.classList.add(...classes);
  btnAddVariant.addEventListener("click", () => {
    console.error("No implementation!");
  });

  divFRTS.appendChild(btnAddVariant);
  divFirstRow.appendChild(divFRTS);
  section.appendChild(divFirstRow);
  container.appendChild(section);

  let sizes = [];
  await sizeService.getSizes()
    .then(response => {
      if(response.status == 200)
        sizes = response.data;
      else
        console.error("Unhandled status code: " + response.status);
    })
    .catch(error => {
      console.error("There was a problem fetching sizes: " + error);
    });

  // Category displaying
  const divSecondRow = document.createElement("div");
  classes = ["flex-16", "p-3", "flex", "gap-[.5rem]", "min-h-0"];
  divSecondRow.classList.add(...classes);  

  const divVariant = document.createElement("div");
  classes = ["flex-3", "grid", "grid-cols-5", "gap-3", "h-max"];
  divVariant.classList.add(...classes);

  if(sizes.length === 0){
    const divVariantCntr = document.createElement("div");
    classes = ["flex", "flex-col", "p-3", "text-primaryColor", "gap-[.3rem]", "rounded-md"];
    divVariantCntr.classList.add(...classes);

    const spanEmptyRecord = document.createElement("span");
    classes = ["font-extrabold"];
    spanEmptyRecord.classList.add(...classes);
    spanEmptyRecord.textContent = "No record found!";
    divVariantCntr.appendChild(spanEmptyRecord);
    divSecondRow.appendChild(divVariantCntr);
  }else{
    console.log(sizes);
    sizes.forEach(size => {
      const divVariantCntr = document.createElement("div");
      classes = ["flex", "flex-col", "p-3", "text-primaryColor", "bg-primaryBg", "gap-[.3rem]", "rounded-md"];
      divVariantCntr.classList.add(...classes);
  
      const spanSizeName = document.createElement("span");
      classes = ["font-extrabold"];
      spanSizeName.classList.add(...classes);
      spanSizeName.textContent = `Size name: ${size.sizeName}`;
      divVariantCntr.appendChild(spanSizeName);

      const actionsBtnCntr = document.createElement("div");
      classes = ["flex", "flex-col", "gap-[.3rem]", "h-[100%]", "justify-end"];
      actionsBtnCntr.classList.add(...classes);

      const editBtn = createOkButton("Edit");
      editBtn.type = "button";
      actionsBtnCntr.appendChild(editBtn);
      editBtn.addEventListener("click", () => {
        console.error("No implementation!");
      });

      const deleteBtn = createCancelBtn("Delete");
      deleteBtn.type = "button";
      actionsBtnCntr.appendChild(deleteBtn);
      deleteBtn.addEventListener("click", () => {
        console.error("No implementation!");
      });

      divVariantCntr.appendChild(actionsBtnCntr);
      divVariant.appendChild(divVariantCntr);
      divSecondRow.appendChild(divVariant);
    });
  }

  section.appendChild(divSecondRow);
  container.appendChild(section);
}