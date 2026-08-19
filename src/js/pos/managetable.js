import { tableListService } from "../services/tablelistservice";

async function renderManageTable(container){
  sessionStorage.setItem("active-tab", "table");

  let classes;

  // #menu-list-container
  const section = document.createElement("section");
  classes = ["flex", "flex-col", "bg-secondaryBg", "h-full", "min-h-0"];
  section.classList.add(...classes);
  section.id = "table-list-container";

  // First Row
  const divFirstRow = document.createElement("div");
  classes = ["flex-1", "border-b-1", "border-borderColor", "p-3", "text-primaryColor", "flex"];
  divFirstRow.classList.add(...classes);

  const selectNOSFilter = document.createElement("select");
  const tableList = await tableListService.getTables();
  selectNOSFilter.add(new Option("All", "", true, true));
  tableList.forEach(table => {
    // Check if an option with that value exists
    const exists = !!selectNOSFilter.querySelector(`option[value="${table.noOfSeats}"]`);

    if(!exists)
      selectNOSFilter.add(new Option(table.noOfSeats, table.noOfSeats));
  });

  selectNOSFilter.addEventListener("change", async (event) => {
    const selectedValue = event.target.value;
    let tableListOptions;
    if(selectedValue === "")
      tableListOptions = await tableListService.getTables();
    
    displayTableList(tableListOptions);
  });

  divFirstRow.appendChild(selectNOSFilter);
  section.appendChild(divFirstRow);

  // Initializes table list
  // Initialize Second Row
  const urlChecker = new URL(window.location.href);
  const searchCatValue = urlChecker.searchParams.get("no_of_seats");
  if(searchCatValue === null) // If no query parameter
    selectNOSFilter.dispatchEvent(new Event('change'));
  // else{ // If there is a query parameter. Click the correct button
  //   const searchFormattedValue = searchCatValue.toLowerCase().replace(/ /g, "-");
  //   const FRLSCntr = document.getElementById("first-row-left-side");
  //   for(const btnChild of FRLSCntr.children){
  //     if(searchFormattedValue === btnChild.id){
  //       const btnRef = document.getElementById(searchFormattedValue);
  //       if(btnRef)
  //         btnRef.click();
  //     }
  //   }
  // }

  function displayTableList(tableListOptions){

    if(section.children.length === 2){
      section.removeChild(section.children[1]);
    }

    const divSecondRow = document.createElement("div");
    classes = ["flex-16", "p-3", "flex", "gap-[.5rem]", "min-h-0", "w-full"];
    divSecondRow.classList.add(...classes);
    
    if(tableListOptions.length > 0){
      // First Column
      const divFC = document.createElement("div");
      classes = ["flex", "flex-col", "gap-3", "h-max", "w-full"];
      divFC.classList.add(...classes);

      tableListOptions.forEach(table => {
        const divTableCntr = document.createElement("div");
        classes = [`CONTAINER-${table.id}`, "flex", "flex-col", "bg-primaryBg", "w-full", "p-3", "rounded-sm", "shadow-md", "text-primaryColor", "font-bold"];
        divTableCntr.classList.add(...classes);

        const divTableCntrTS = document.createElement("div");
        classes = ["flex", "justify-between"];
        divTableCntrTS.classList.add(...classes);
        const spanTableName = document.createElement("span");
        spanTableName.textContent = table.tableName;
        divTableCntrTS.appendChild(spanTableName);
        
        divTableCntrTS.innerHTML += 
        `
          <svg id="${table.id}-SVG-MORE" class="cursor-pointer flex" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 14C18 14 13.5811 19 12 19C10.4188 19 6 14 6 14" stroke="#3A6EA5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 9.99996C18 9.99996 13.5811 5.00001 12 5C10.4188 4.99999 6 10 6 10" stroke="#3A6EA5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;

        const svgCaretMoreRef = divTableCntrTS.querySelector(`svg`);
        svgCaretMoreRef.addEventListener("click", () => {
          const collapsibleContentRef = document.getElementById(`${table.id}-SVG-COLLAPSIBLE`);
          
          if(divCollapsibleContent.classList.contains("hidden")){
            divCollapsibleContent.classList.add("flex");
            divCollapsibleContent.classList.remove("hidden");
            const paths = svgCaretMoreRef.querySelectorAll('path');
            if (paths.length >= 2) {
              paths[0].setAttribute("d", "M18 6C18 6 13.5811 11 12 11C10.4188 11 6 6 6 6");
              paths[1].setAttribute("d", "M18 18C18 18 13.5811 13 12 13C10.4188 13 6 18 6 18");
            }
          }else{
            divCollapsibleContent.classList.add("hidden");
            divCollapsibleContent.classList.remove("flex");
            const paths = svgCaretMoreRef.querySelectorAll('path');
            if (paths.length >= 2) {
              paths[0].setAttribute("d", "M18 14C18 14 13.5811 19 12 19C10.4188 19 6 14 6 14");
              paths[1].setAttribute("d", "M18 9.99996C18 9.99996 13.5811 5.00001 12 5C10.4188 4.99999 6 10 6 10");
            }
          }
        });
        
        const divCollapsibleContent = document.createElement("div");
        classes = ["hidden", "relative"];
        divCollapsibleContent.classList.add(...classes);
        divCollapsibleContent.id = `${table.id}-SVG-COLLAPSIBLE`;
        const spanTest = document.createElement("span");
        spanTest.textContent = "test";
        divCollapsibleContent.appendChild(spanTest);
        
        divTableCntr.appendChild(divTableCntrTS);
        divTableCntr.appendChild(divCollapsibleContent);
        divFC.appendChild(divTableCntr);
      });
      
      divSecondRow.appendChild(divFC);
      section.appendChild(divSecondRow);
    }
  }

  container.appendChild(section);
}

export { renderManageTable }; 