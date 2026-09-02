import { tableListService } from "../services/tablelistservice";
import { orderService } from "../services/orderservice";

// The table list view should have filter for the number of seats. >= No. of seats is the filter :REMOVE-COMMENT 
// We should also add `available` tables as filter :REMOVE-COMMENT
// UI Bug when there is no filtered no. of seats :REMOVE-COMMENT

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

  async function displayTableList(tableListOptions){
    if(section.children.length === 2){
      section.removeChild(section.children[1]);
    }

    const divSecondRow = document.createElement("div");
    classes = ["flex-16", "p-3", "flex", "gap-[.5rem]", "min-h-0", "w-full"];
    divSecondRow.classList.add(...classes);
    
    if(tableListOptions != null && tableListOptions.length > 0){
      // First Column
      const divFC = document.createElement("div");
      classes = ["flex", "flex-col", "gap-3", "h-max", "w-full"];
      divFC.classList.add(...classes);

      tableListOptions.forEach(async (table) => {
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
        svgCaretMoreRef.addEventListener("click", async () => {
          if(divCollapsibleContent.classList.contains("active")){ // Collapsible hides
            classes = ["border-b-1", "border-borderColor", "pb-[.3rem]"];
            divTableCntrTS.classList.remove(...classes);
            divCollapsibleContent.classList.remove("active");

            removeParams();
            
            const paths = svgCaretMoreRef.querySelectorAll('path');
            if (paths.length >= 2) {
              paths[0].setAttribute("d", "M18 14C18 14 13.5811 19 12 19C10.4188 19 6 14 6 14");
              paths[1].setAttribute("d", "M18 9.99996C18 9.99996 13.5811 5.00001 12 5C10.4188 4.99999 6 10 6 10");
            }
          }else{ // Collapsible shows
            classes = ["border-b-1", "border-borderColor", "pb-[.3rem]"];
            divTableCntrTS.classList.add(...classes);
            divCollapsibleContent.classList.add("active");
            const paths = svgCaretMoreRef.querySelectorAll('path');
            const orderList = await orderService.getOrderByTableId(`${table.id}`);

            const url = new URL(window.location.href);
            url.searchParams.set("table", table.id);
            window.history.pushState({}, "", url);

            populateCollapsibleContent(orderList, divCollapsibleContent);
            if (paths.length >= 2) {
              paths[0].setAttribute("d", "M18 5C18 5 13.5811 10 12 10C10.4188 10 6 5 6 5");
              paths[1].setAttribute("d", "M18 19C18 19 13.5811 14 12 14C10.4188 14 6 19 6 19");
            }
          }
        });
        
        const divCollapsibleContent = document.createElement("div");
        classes = ["collapsible-content", "pl-[.8rem]"];
        divCollapsibleContent.classList.add(...classes);
        divCollapsibleContent.id = `${table.id}-SVG-COLLAPSIBLE`;
        
        divTableCntr.appendChild(divTableCntrTS);
        divTableCntr.appendChild(divCollapsibleContent);
        divFC.appendChild(divTableCntr);
      });
      
      divSecondRow.appendChild(divFC);
      section.appendChild(divSecondRow);
    }
  }

  function populateCollapsibleContent(orderList, collapSibleCntrRef){
    if(orderList.length > 0){
      collapSibleCntrRef.innerHTML = ""; // Resets to empty

      const divOLCntr = document.createElement("div");
      classes = ["flex", "flex-col", "mt-[.3rem]"];
      divOLCntr.classList.add(...classes);

      const receiptNo = orderList[0].receiptNo;
      const h1ReceiptNo = document.createElement("h1");
      classes = ["text-lg"];
      h1ReceiptNo.classList.add(...classes);
      h1ReceiptNo.textContent = `Receipt No: ${receiptNo}`;
      divOLCntr.appendChild(h1ReceiptNo);
      
      let totalPrice = 0;
      const tableOrderContentCntr = document.createElement("table");
      classes = [];
      tableOrderContentCntr.classList.add(...classes);

      const theadOrderContentCntr = document.createElement("thead");
      classes = ["border-t"];
      theadOrderContentCntr.classList.add(...classes);
      const trTheadCntr = document.createElement("tr");
      // Description
      const thTheadDescription = document.createElement("th");
      classes = ["text-start"];
      thTheadDescription.classList.add(...classes);
      thTheadDescription.textContent = "Description";
      trTheadCntr.appendChild(thTheadDescription);

      // Size
      const thTheadSize = document.createElement("th");
      thTheadSize.classList.add(...classes);
      thTheadSize.textContent = "Size";
      trTheadCntr.appendChild(thTheadSize);

      // Quantity
      const thTheadQty = document.createElement("th");
      thTheadQty.classList.add(...classes);
      thTheadQty.textContent = "Quantity";
      trTheadCntr.appendChild(thTheadQty);

      // Price
      const thTheadPrice = document.createElement("th");
      thTheadPrice.classList.add(...classes);
      thTheadPrice.textContent = "Price";
      trTheadCntr.appendChild(thTheadPrice);

      theadOrderContentCntr.appendChild(trTheadCntr);
      tableOrderContentCntr.appendChild(theadOrderContentCntr);

      const tbodyOrderContentCntr = document.createElement("tbody");
      orderList.forEach(order => {
        const trBodyCntr = document.createElement("tr");
        classes = ["border-t", "font-light"];
        trBodyCntr.classList.add(...classes);

        // Description
        const tdBodyDescription = document.createElement("td");
        classes = ["w-[25%]"];
        tdBodyDescription.classList.add(...classes);
        tdBodyDescription.textContent = order.shortFoodDesc;
        trBodyCntr.appendChild(tdBodyDescription);

        // Size
        const tdBodySize = document.createElement("td");
        tdBodySize.classList.add(...classes);
        tdBodySize.textContent = order.size;
        trBodyCntr.appendChild(tdBodySize);

        // Quantity
        const tdBodyQuantity = document.createElement("td");
        classes = ["w-[25%]", "text-center"]
        tdBodyQuantity.classList.add(...classes);
        tdBodyQuantity.textContent = order.quantity;
        trBodyCntr.appendChild(tdBodyQuantity);

        // Price
        const tdBodyPrice = document.createElement("td");
        tdBodyPrice.classList.add(...classes);
        const formattedPrice = new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP"
        }).format(order.price);
        tdBodyPrice.textContent = formattedPrice;
        trBodyCntr.appendChild(tdBodyPrice);

        // Total Price
        totalPrice += (order.price * order.quantity);

        tbodyOrderContentCntr.appendChild(trBodyCntr);
      });
      const tfootTableOrderContentCntr = document.createElement("tfoot");
      classes = ["border-t"];
      tfootTableOrderContentCntr.classList.add(...classes);
      const trFootCntr = document.createElement("tr");

      // Description
      const tdFootDescription = document.createElement("td");
      classes = ["text-center"];
      tdFootDescription.classList.add(...classes);
      tdFootDescription.colSpan = 3;
      tdFootDescription.textContent = "Total Price";
      trFootCntr.appendChild(tdFootDescription);

      // Total Price
      const tdFootTotalPrice = document.createElement("td");
      classes = ["text-center"];
      const formattedTotalPrice = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
      }).format(totalPrice);
      tdFootTotalPrice.textContent = formattedTotalPrice;
      tdFootTotalPrice.classList.add(...classes);
      trFootCntr.appendChild(tdFootTotalPrice);
      tfootTableOrderContentCntr.appendChild(trFootCntr);

      tableOrderContentCntr.appendChild(tbodyOrderContentCntr);
      tableOrderContentCntr.appendChild(tfootTableOrderContentCntr);

      const divBtnCntr = document.createElement("div");
      classes = ["flex", "gap-[.3rem]", "w-fit"];
      divBtnCntr.classList.add(...classes);

      // Button (used for returning into menu list)
      const btnReturnToMenuList = document.createElement("button");
      classes = ["bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "p-[.4rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
      btnReturnToMenuList.classList.add(...classes);
      btnReturnToMenuList.textContent = "Return to menu list";
      btnReturnToMenuList.addEventListener("click", async () => {
        // Checking if there are still unplaced menu.
        const exitingOrder = await orderService.getUnplacedOrders();
        if(exitingOrder.length > 0){
          alert("There are unplaced orders on the menu list. Please complete it first.");
          return;
        }

        const patchRequest = {
          tableNo: null,
          placed: false,
          orderType: null
        };

        const response = await orderService.patchRetrieveOrderByReceiptNo(receiptNo, patchRequest);
        if(response.status === 200){
          alert(`Receipt No# ${receiptNo} was retrieved. Please check in menu list tab`);
          window.location.reload();
        }else{
          alert("There was a problem updating the record. Please try again");
        }
      });
      divBtnCntr.appendChild(btnReturnToMenuList);

      // Checkout/Billout
      const btnBillOut = document.createElement("button");
      btnBillOut.classList.add(...classes);
      btnBillOut.textContent = "Bill-out";
      btnBillOut.addEventListener("click", () => {

      });
      divBtnCntr.appendChild(btnBillOut);

      divOLCntr.appendChild(tableOrderContentCntr);
      divOLCntr.appendChild(divBtnCntr);
      collapSibleCntrRef.appendChild(divOLCntr);
    }else{
      collapSibleCntrRef.innerHTML = ""; // Resets to empty
      const spanMessage = document.createElement("span");
      spanMessage.textContent = "No order placed yet";
      collapSibleCntrRef.appendChild(spanMessage);
    }
  }

  container.appendChild(section);

  // Utilities
  function removeParams(){
    const url = new URL(window.location.href);
    const newUrl = url.origin + "/landingpage";
    window.history.replaceState({}, "", newUrl);
  }
}

export { renderManageTable }; 