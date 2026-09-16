import { tableListService } from "../services/tablelistservice";
import { orderService } from "../services/orderservice";

// The table list view should have filter for the number of seats. >= No. of seats is the filter :REMOVE-COMMENT 
// We should also add `available` tables as filter :REMOVE-COMMENT
// UI Bug when there is no filtered no. of seats :REMOVE-COMMENT
// !PRIORITIZE!
// Bill out functionality :REMOVE-COMMENT

async function renderManageTable(container){
  const formatAmount = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  });

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
    
    await displayTableList(tableListOptions);
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

            await populateCollapsibleContent(orderList, divCollapsibleContent);
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

  async function populateCollapsibleContent(orderList, collapSibleCntrRef){
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
      
      let totalAmount = 0;
      const tableOrderContentCntr = document.createElement("table");
      classes = [];
      tableOrderContentCntr.classList.add(...classes);

      const theadOrderContentCntr = document.createElement("thead");
      classes = ["border-t"];
      theadOrderContentCntr.classList.add(...classes);
      const trTheadCntr = document.createElement("tr");
      // Description
      const thTheadDescription = document.createElement("th");
      classes = ["text-start", "15%"];
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
      
      // Amount
      const thTheadAmount = document.createElement("th");
      thTheadAmount.classList.add(...classes);
      thTheadAmount.textContent = "Amount";
      trTheadCntr.appendChild(thTheadAmount);
      
      // Discount
      const thTheadDiscAmt = document.createElement("th");
      thTheadDiscAmt.classList.add(...classes);
      thTheadDiscAmt.textContent = "Discount Amount";
      trTheadCntr.appendChild(thTheadDiscAmt);

      theadOrderContentCntr.appendChild(trTheadCntr);
      tableOrderContentCntr.appendChild(theadOrderContentCntr);

      const tbodyOrderContentCntr = document.createElement("tbody");
      orderList.forEach(order => {
        const trBodyCntr = document.createElement("tr");
        classes = ["border-t", "font-light"];
        trBodyCntr.classList.add(...classes);

        // Description
        const tdBodyDescription = document.createElement("td");
        // tdBodyDescription.classList.add(...classes);
        tdBodyDescription.textContent = order.shortFoodDesc;
        trBodyCntr.appendChild(tdBodyDescription);

        // Size
        const tdBodySize = document.createElement("td");
        // tdBodySize.classList.add(...classes);
        tdBodySize.textContent = order.size;
        trBodyCntr.appendChild(tdBodySize);

        // Quantity
        const tdBodyQuantity = document.createElement("td");
        // classes = ["w-[25%]", "text-center"]
        // tdBodyQuantity.classList.add(...classes);
        tdBodyQuantity.textContent = order.quantity;
        trBodyCntr.appendChild(tdBodyQuantity);

        // Price
        const tdBodyPrice = document.createElement("td");
        // tdBodyPrice.classList.add(...classes);
        tdBodyPrice.textContent = formatAmount.format(order.price);
        trBodyCntr.appendChild(tdBodyPrice);
        
        // Amount
        const tdBodyAmount = document.createElement("td");
        // tdBodyAmount.classList.add(...classes);
        tdBodyAmount.textContent = formatAmount.format(order.amount);
        trBodyCntr.appendChild(tdBodyAmount);
        
        // Discount Amount
        const tdBodyDiscAmount = document.createElement("td");
        // tdBodyDiscAmount.classList.add(...classes);
        tdBodyDiscAmount.textContent = formatAmount.format(order.discountAmount);
        trBodyCntr.appendChild(tdBodyDiscAmount);

        // Total Amount
        if(order.entryType == "ORDER")
          totalAmount += order.amount;
        else if(order.entryType == "PAYMENT")
          totalAmount -= order.amount;

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
      tdFootDescription.colSpan = 4;
      tdFootDescription.textContent = "Amount to Pay";
      trFootCntr.appendChild(tdFootDescription);

      // Total Amount
      const tdFootTotalPrice = document.createElement("td");
      tdFootTotalPrice.textContent = formatAmount.format(totalAmount);
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

      // Prints bill-out receipt
      // Can only be printed once? :REMOVE-COMMENT
      const btnBillOut = document.createElement("button");
      btnBillOut.classList.add(...classes);
      btnBillOut.textContent = "Print bill-out receipt";
      divBtnCntr.appendChild(btnBillOut);

      // Post Order
      const btnPostOrder = document.createElement("button");
      btnPostOrder.classList.add(...classes);
      btnPostOrder.textContent = "Post order";
      // (0 - Tender Description) (1 - 1 - without arrow, 2 - with arrow) (2 - Tender Type Code)
      const tenderTypes = [['Cash', 1, 1], ['Card', 2, 2], ['QR Payment', 2, 3]];
      btnPostOrder.addEventListener("click", () => {
        const bodyRef = document.getElementById("body");

        const divModalPostOrder = document.createElement("div");
        classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
        divModalPostOrder.classList.add(...classes);

        const divModalPostOrderCntr = document.createElement("div");
        classes = ["grid", "grid-cols-3", "gap-[.6rem]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
        divModalPostOrderCntr.classList.add(...classes);

        tenderTypes.forEach(tenderType => {
          const divTTCntr = document.createElement("div");
          classes = ["flex", "bg-primaryColor", "gap-[.3rem]", "justify-between", "p-2", "rounded-md", "cursor-pointer"];
          divTTCntr.classList.add(...classes);

          const spanTTDesc = document.createElement("span");
          spanTTDesc.textContent = tenderType[0];
          divTTCntr.appendChild(spanTTDesc);

          if(tenderType[1] === 2){
            divTTCntr.innerHTML += 
            `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#FFF" stroke-width="1.5"/>
              <path d="M15 12L8 12M12.5002 8.5C12.5002 8.5 16.0002 11.0777 16.0002 12C16.0002 12.9223 12.5002 15.5 12.5002 15.5" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `;

            divTTCntr.addEventListener("click", () => {

            });
          }else{
            divTTCntr.addEventListener("click", async () => {
              await openNumericKeyboardLayout(bodyRef, divModalPostOrder, tenderType, totalAmount, orderList, collapSibleCntrRef);
            });
          }

          divModalPostOrderCntr.appendChild(divTTCntr);
        });

        // const btnCancel = document.createElement("button");
        // classes = ["p-2", "rounded-md", "bg-errorAlert", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-errorAlert/50"];
        // btnCancel.classList.add(...classes);
        // btnCancel.textContent = "Cancel";
        const btnCancel = createCancelBtn();
        divModalPostOrderCntr.appendChild(btnCancel);
        
        divModalPostOrder.appendChild(divModalPostOrderCntr, collapSibleCntrRef);
        bodyRef.appendChild(divModalPostOrder);

        btnCancel.addEventListener("click", () => {
          bodyRef.removeChild(divModalPostOrder);
        });
      });
      divBtnCntr.appendChild(btnPostOrder);

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

  async function openNumericKeyboardLayout(bodyRef, divModalPostOrder, tenderType, totalAmtToPay, orderList, collapSibleCntrRef){
    bodyRef.removeChild(divModalPostOrder);
    const numericKeyboard = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "."];
    // Main numeric popup container
    const divNumKeyboard = document.createElement("div");
    classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
    divNumKeyboard.classList.add(...classes);

    const divNumKeyboardCntr = document.createElement("div");
    classes = ["grid", "grid-cols-3", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
    divNumKeyboardCntr.classList.add(...classes);

    const formAmountPayment = document.createElement("form");     
    classes = ["col-span-full", "flex", "gap-[.5rem]", "text-black"];
    formAmountPayment.classList.add(...classes);

    const inputAmount = document.createElement("input");
    classes = ["w-full", "border-[.1rem]", "border-black"];
    inputAmount.classList.add(...classes);
    inputAmount.type = "text";
    inputAmount.addEventListener("input", (e) => {
        let value = e.target.value;

        // Strip out everything except digits and a single decimal point
        value = value.replace(/[^0-9.]/g, '');

        // Prevent a second decimal point from being typed
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Limit decimals to exactly 2 places (cents)
        if (parts[1] && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }

        // Cap the value to thousands max (e.g., maximum 9999.99)
        // If the integer part exceeds 4 digits, slice it back to 4 digits
        // if (parts[0].length > 4) {
        //     const truncatedInteger = parts[0].substring(0, 4);
        //     value = parts[1] !== undefined ? truncatedInteger + '.' + parts[1] : truncatedInteger;
        // }

        // Update the input field with the cleaned value
        e.target.value = value;
    });
    formAmountPayment.appendChild(inputAmount);

    // formAmountPayment.innerHTML += 
    // `
    // <svg id="form-delete-number" class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path d="M22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H11C9.03719 4 8.05573 4 7.21114 4.42229C6.36655 4.84458 5.77769 5.62972 4.6 7.2C2.86667 9.51111 2 10.6667 2 12C2 13.3333 2.86667 14.4889 4.6 16.8C5.77769 18.3703 6.36655 19.1554 7.21114 19.5777C8.05573 20 9.03719 20 11 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12Z" stroke="#141B34" stroke-width="1.5"/>
    //   <path d="M10 9L16 14.9996M10 15L16 9.00039" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    // </svg>
    // `;

    divNumKeyboardCntr.appendChild(formAmountPayment);

    numericKeyboard.forEach(numericItem => {
      const divNumericItemCntr = document.createElement("div");
      classes = ["flex", "justify-center", "bg-secondaryColor", "p-2", "cursor-pointer"];
      divNumericItemCntr.classList.add(...classes);
      divNumericItemCntr.addEventListener("click", () => {
        let currentAmount = inputAmount.value;

        currentAmount = currentAmount + numericItem;

        inputAmount.value = currentAmount;
      });

      const spanNumericContent = document.createElement("span");
      spanNumericContent.textContent = numericItem;

      divNumericItemCntr.appendChild(spanNumericContent);
      divNumKeyboardCntr.appendChild(divNumericItemCntr);
    });

    const divBtnCntr = document.createElement("div");
    classes = ["col-span-full", "flex", "gap-[.3rem]"];
    divBtnCntr.classList.add(...classes);

    // const btnOk = document.createElement("button");
    // classes = ["p-2", "rounded-md", "bg-sucessConfirm", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-sucessConfirm/50"];
    // btnOk.classList.add(...classes);
    // btnOk.textContent = "OK";
    const btnOk = createOkButton();
    divBtnCntr.appendChild(btnOk);
    btnOk.addEventListener("click", async () => {
      let payment = inputAmount.value;

      if(payment == "" || payment == null){
        alert("Please input an amount.");
        return;
      }
      
      // check if comma is not used properly.
      if(payment.includes(',')){
        let arrPayment = payment.split(',');
        arrPayment.forEach((element, index) => {
          if(index === 0){
            if(element.length > 3){
              inputAmount.value = "";
              alert("Invalid comma placement.");
              return;
            }
          }else if (element.length != 3){
              inputAmount.value = "";
              alert("Invalid comma placement.");
              return;
          }
        });
      }

      const paymentData = {
        number: tenderType[2],
        payment: payment,
        totalAmount: totalAmtToPay,
        shortFoodDesc: tenderType[0],
        receiptNo: orderList[0].receiptNo,
        tableNo: orderList[0].tableId
      }
      const response = await orderService.postPaymentLine(paymentData);

      if(response.processTransaction){
        // Posting of transaction
        bodyRef.removeChild(divNumKeyboard);
        const orderList = await orderService.getOrderByTableId(`${paymentData.tableNo}`);
        PostBreakdownDisplay(bodyRef, totalAmtToPay, payment, orderList);
      }else{
        bodyRef.removeChild(divNumKeyboard);
        const orderList = await orderService.getOrderByTableId(`${paymentData.tableNo}`);
        populateCollapsibleContent(orderList, collapSibleCntrRef);
      }
    });

    // const btnCancel = document.createElement("button");
    // classes = ["p-2", "rounded-md", "bg-errorAlert", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-errorAlert/50"];
    // btnCancel.classList.add(...classes);
    // btnCancel.textContent = "Cancel";
    
    const btnCancel = createCancelBtn();
    divBtnCntr.appendChild(btnCancel);

    divNumKeyboardCntr.appendChild(divBtnCntr);

    divNumKeyboard.appendChild(divNumKeyboardCntr)
    bodyRef.appendChild(divNumKeyboard);

    btnCancel.addEventListener("click", () => {
      bodyRef.removeChild(divNumKeyboard);
    });

    // const svgDeleteNumRef = document.getElementById("form-delete-number");
    // svgDeleteNumRef.addEventListener("click", () => {
    //   // Should delete the first number from the right :REMOVE-COMMENT
    //   // Logic is not working :REMOVE-COMMENT
    //   let currentAmount = inputAmount.value;
    //   if(currentAmount.length > 0){
    //     currentAmount = currentAmount.substring(0, (currentAmount.length - 2));
    //   }

    //   inputAmount.value = currentAmount;
    // });
  }

  function PostBreakdownDisplay(bodyRef, totalAmtToPay, payment, orderList){
    // Should clear the line & move to sales :REMOVE-COMMENT
    // Should also display the break down + the total amount and change

    const breakdownDiv = document.createElement("div");
    classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
    breakdownDiv.classList.add(...classes);

    const breakdownDivCntr = document.createElement("div");
    classes = ["flex", "flex-col", "gap-[.6rem]", "w-[90%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
    breakdownDivCntr.classList.add(...classes);

    const orderTable = document.createElement("table");
    classes = ["text-primaryColor", "w-full"];
    orderTable.classList.add(...classes);
    const orderTableTHead = document.createElement("thead");
    const orderTableTr = document.createElement("tr");
    // Table header
    const OTDescTh = document.createElement("th");
    classes = ["text-start", "15%"];
    OTDescTh.classList.add(...classes);
    OTDescTh.textContent = "Description";
    orderTableTr.appendChild(OTDescTh);
    const OTSizeTh = document.createElement("th");
    OTSizeTh.classList.add(...classes);
    OTSizeTh.textContent = "Size";
    orderTableTr.appendChild(OTSizeTh);
    const OTQtyTh = document.createElement("th");
    OTQtyTh.classList.add(...classes);
    OTQtyTh.textContent = "Quantity";
    orderTableTr.appendChild(OTQtyTh);
    const OTPriceTh = document.createElement("th");
    OTPriceTh.classList.add(...classes);
    OTPriceTh.textContent = "Price";
    orderTableTr.appendChild(OTPriceTh);
    const OTAmountTh = document.createElement("th");
    OTAmountTh.classList.add(...classes);
    OTAmountTh.textContent = "Amount";
    orderTableTr.appendChild(OTAmountTh);
    const OTDiscAmtTh = document.createElement("th");
    OTDiscAmtTh.classList.add(...classes);
    OTDiscAmtTh.textContent = "Discount Amount";
    orderTableTr.appendChild(OTDiscAmtTh);
    orderTableTHead.appendChild(orderTableTr);
    orderTable.appendChild(orderTableTHead);

    // Table body
    const OTTableTBody = document.createElement("tbody");
    orderList.forEach(order => {
      const orderTableTrBody = document.createElement("tr");
      // Description
      const OTDescTd = document.createElement("td");
      OTDescTd.textContent = order.shortFoodDesc;
      orderTableTrBody.appendChild(OTDescTd);
      // Size
      const OTSizeTd = document.createElement("td");
      OTSizeTd.textContent = order.size;
      orderTableTrBody.appendChild(OTSizeTd);
      
      // Quantity
      const OTQtyTd = document.createElement("td");
      OTQtyTd.textContent = order.quantity;
      orderTableTrBody.appendChild(OTQtyTd);
      
      // Price
      const OTPriceTd = document.createElement("td");
      OTPriceTd.textContent = order.price;
      orderTableTrBody.appendChild(OTPriceTd);
      OTPriceTd.textContent = formatAmount.format(order.price);
      orderTableTrBody.appendChild(OTPriceTd);

      // Amount
      const OTAmountTd = document.createElement("td");
      OTAmountTd.textContent = order.amount;
      orderTableTrBody.appendChild(OTAmountTd);
      OTAmountTd.textContent = formatAmount.format(order.amount);
      orderTableTrBody.appendChild(OTAmountTd);
      
      // Discount Amount
      const OTDiscAmtTd = document.createElement("td");
      OTDiscAmtTd.textContent = order.discountAmount;
      OTDiscAmtTd.textContent = formatAmount.format(order.discountAmount);
      orderTableTrBody.appendChild(OTDiscAmtTd);

      orderTableTrBody.appendChild(OTDiscAmtTd);
      OTTableTBody.appendChild(orderTableTrBody);
    });
    orderTable.appendChild(OTTableTBody);

    const orderTableTfoot = document.createElement("tfoot");
    classes = ["border-t"];
    orderTableTfoot.classList.add(...classes);
    const orderTableTrTotalAmt = document.createElement("tr");
    // Total Amount
    const OTTotalAmtTdFooter = document.createElement("td");
    OTTotalAmtTdFooter.colSpan = 4;
    OTTotalAmtTdFooter.textContent = "Total Amount";
    orderTableTrTotalAmt.appendChild(OTTotalAmtTdFooter);
    // Total Amount Value
    const OTTotalAmtValueTdFooter = document.createElement("td");
    OTTotalAmtValueTdFooter.textContent = formatAmount.format(totalAmtToPay);
    orderTableTrTotalAmt.appendChild(OTTotalAmtValueTdFooter);
    
    const orderTableTrPayment = document.createElement("tr");
    // Payment
    const OTPaymentTdFooter = document.createElement("td");
    OTPaymentTdFooter.colSpan = 4;
    OTPaymentTdFooter.textContent = "Payment";
    orderTableTrPayment.appendChild(OTPaymentTdFooter);
    // Payment Value
    const OTPaymentValueTdFooter = document.createElement("td");
    OTPaymentValueTdFooter.textContent = formatAmount.format(payment);
    orderTableTrPayment.appendChild(OTPaymentValueTdFooter);
    
    const orderTableTrChange = document.createElement("tr");
    // Change
    const OTChangeTdFooter = document.createElement("td");
    OTChangeTdFooter.colSpan = 4;
    OTChangeTdFooter.textContent = "Change";
    orderTableTrChange.appendChild(OTChangeTdFooter);
    // Change Value
    const OTChangeValueTdFooter = document.createElement("td");
    OTChangeValueTdFooter.textContent = formatAmount.format(payment - totalAmtToPay);
    orderTableTrChange.appendChild(OTChangeValueTdFooter);

    orderTableTfoot.appendChild(orderTableTrTotalAmt)
    orderTableTfoot.appendChild(orderTableTrPayment)
    orderTableTfoot.appendChild(orderTableTrChange)
    orderTable.appendChild(orderTableTfoot);
    
    const okBtn = createOkButton();

    breakdownDivCntr.appendChild(orderTable);
    breakdownDivCntr.appendChild(okBtn);
    breakdownDiv.appendChild(breakdownDivCntr);
    bodyRef.appendChild(breakdownDiv);

    okBtn.addEventListener("click", () => {
      bodyRef.removeChild(breakdownDiv);
    });
  }

  function createOkButton(){
    let createOkBtn = document.createElement("button");
    createOkBtn.textContent = "OK";
    classes = ["p-2", "rounded-md", "bg-sucessConfirm", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-sucessConfirm/50"];
    createOkBtn.classList.add(...classes);

    return createOkBtn;
  }

  function createCancelBtn(){
    let createCancelBtn = document.createElement("button");
    classes = ["p-2", "rounded-md", "bg-errorAlert", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-errorAlert/50"];
    createCancelBtn.classList.add(...classes);
    createCancelBtn.textContent = "Cancel";

    return createCancelBtn;
  }
}

export { renderManageTable }; 