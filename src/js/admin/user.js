import { userService } from "../services/userservice";
import { createCancelBtn, createDefaultBtn, createDeleteBtn, createInputPassword, createInputTextNew, createLabelNew, createOkButton, createSelect, removeParams } from "../utilities.js";

export async function renderUser(container){
  sessionStorage.setItem("active-tab", "user");  

  let classes;
  let userRoles = null;

  await userService.getUserRoles()
    .then(response => {
      if(response.status === 200){
        userRoles = response.data;
      }
    })
    .catch(error => {
      console.error("There was a problem fetching roles: " + error);
    });

  const section = document.createElement("section");
  classes = ["flex", "flex-col", "h-full", "min-h-0", "max-h-max"];
  section.classList.add(...classes);
  section.id = "user-container";

  // First Row
  const divFirstRow = document.createElement("div");
  classes = ["flex-1", "flex", "flex-col", "gap-[.6rem]", "border-b-1", "border-borderColor", "p-3"];
  divFirstRow.classList.add(...classes);

  // First Row Top Side
  const divFRTS = document.createElement("div");
  divFRTS.id = "first-row-top-side";
  classes = ["flex", "gap-2"];
  divFRTS.classList.add(...classes);

  const btnAddUser = document.createElement("button");
  btnAddUser.textContent = "ADD USER";
  classes = ["text-xs", "border-1", "p-2", "rounded-sm", "border-dividerColor", "bg-white", "text-primaryColor", "leading-none", "cursor-pointer", "hover:bg-primaryColor", "hover:text-primaryBg"];
  btnAddUser.classList.add(...classes);
  btnAddUser.addEventListener("click", () => {
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
    spanAddTitle.textContent = "Add User";
    divAddPopupCntr.appendChild(spanAddTitle);

    const formAddUser = document.createElement("form");
    classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
    formAddUser.classList.add(...classes);

    // Username
    const divFormUsernameCntr = document.createElement("div");
    const inputUsername = createInputTextNew("user-username", "username");
    const lblUsername = createLabelNew("Username", "user-username");
    divFormUsernameCntr.appendChild(lblUsername);
    divFormUsernameCntr.appendChild(inputUsername);
    formAddUser.appendChild(divFormUsernameCntr);
    
    // Password
    const divFormPasswordCntr = document.createElement("div");
    const inputPassword = createInputPassword("user-password", "password");
    const lblPassword = createLabelNew("Password", "user-password");
    divFormPasswordCntr.appendChild(lblPassword);
    divFormPasswordCntr.appendChild(inputPassword);
    formAddUser.appendChild(divFormPasswordCntr);

    // Firstname
    const divFormFirstnameCntr = document.createElement("div");
    const inputFirstname = createInputTextNew("user-firstname", "firstname");
    const lblFirstname = createLabelNew("Firstname", "user-firstname");
    divFormFirstnameCntr.appendChild(lblFirstname);
    divFormFirstnameCntr.appendChild(inputFirstname);
    formAddUser.appendChild(divFormFirstnameCntr);

    // Lastname
    const divFormLastname = document.createElement("div");
    const inputLastname = createInputTextNew("user-lastname", "lastname");
    const lblLastname = createLabelNew("Lastname", "user-lastname");
    divFormLastname.appendChild(lblLastname);
    divFormLastname.appendChild(inputLastname);
    formAddUser.appendChild(divFormLastname);

    // Address
    const divFormAddress = document.createElement("div");
    const inputAddress = createInputTextNew("user-address", "address");
    const lblAddress = createLabelNew("Address", "user-address");
    divFormAddress.appendChild(lblAddress);
    divFormAddress.appendChild(inputAddress);
    formAddUser.appendChild(divFormAddress);
    
    // Name on receipt
    const divFormNameOnReceipt = document.createElement("div");
    const inputNameOnReceipt = createInputTextNew("user-name-on-receipt", "nameOnReceipt");
    const lblNameOnReceipt = createLabelNew("Name on receipt", "user-name-on-receipt");
    divFormNameOnReceipt.appendChild(lblNameOnReceipt);
    divFormNameOnReceipt.appendChild(inputNameOnReceipt);
    formAddUser.appendChild(divFormNameOnReceipt);

    // User Role
    const divFormUserRole = document.createElement("div");
    const selectUserRole = createSelect("user-userrole");
    userRoles.forEach(role => {
      selectUserRole.add(new Option(role, role));
    });
    const lblUserRole = createLabelNew("User role", "user-userrole");
    divFormUserRole.appendChild(lblUserRole);
    divFormUserRole.appendChild(selectUserRole);
    formAddUser.appendChild(divFormUserRole);

    const divBtnCntr = document.createElement("div");
    classes = ["col-span-full", "flex", "gap-[.3rem]"];
    divBtnCntr.classList.add(...classes);
    const saveBtn = createOkButton("Save");
    saveBtn.type = "button";
    divBtnCntr.appendChild(saveBtn);
    const cancelBtn = createCancelBtn("Cancel");
    cancelBtn.type = "button";
    divBtnCntr.appendChild(cancelBtn);
    formAddUser.appendChild(divBtnCntr);

    divAddPopupCntr.appendChild(formAddUser);
    divAddPopup.appendChild(divAddPopupCntr);
    body.appendChild(divAddPopup);

    saveBtn.addEventListener("click", async () => {
      const username = (inputUsername.value.trim() == "" || inputUsername.value == null) ? "" : inputUsername.value.trim();
      const password = (inputPassword.value.trim() == "" || inputPassword.value == null) ? "" : inputPassword.value.trim();
      const firstname = (inputFirstname.value.trim() == "" || inputFirstname.value == null) ? "" : inputFirstname.value.trim();
      const lastname = (inputLastname.value.trim() == "" || inputLastname.value == null) ? "" : inputLastname.value.trim();
      const address = (inputAddress.value.trim() == "" || inputAddress.value == null) ? "" : inputAddress.value.trim();
      const nameOnReceipt = (inputNameOnReceipt.value.trim() == "" || inputNameOnReceipt.value == null) ? "" : inputNameOnReceipt.value.trim();
      const userRole = selectUserRole.value;

      if(
        username == "" ||
        password == "" ||
        firstname == "" ||
        lastname == "" ||
        address == "" ||
        nameOnReceipt == ""
      ){
        alert("Please fill required fields");
        return;
      }
      
      if(username.split(" ").length > 1){
        alert("Username should not contain any spaces");
        return;
      }

      const userPostRequest = {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        address: address,
        nameOnReceipt: nameOnReceipt,
        userRole: userRole
      };

      await userService.postUser(userPostRequest)
        .then(response => {
          if(response.status === 201){
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
          }else{
            console.error("Unhandled status code: " + response.status);
          }
        })
        .catch(error => {
          console.error("There was a problem creating a user: " + error);
        });
    });

    cancelBtn.addEventListener("click", () => {
      body.removeChild(divAddPopup);
    });
  });
  divFRTS.appendChild(btnAddUser);

  divFirstRow.appendChild(divFRTS);

  section.appendChild(divFirstRow);
  container.appendChild(section);
  
  await userService.getUsers()
    .then(response => {
      if(response.status === 200){
        displayUserList(response.data);
      }else{
        console.error("Unhandled status code: " + response.status);
      }
    })
    .catch(error => {
      console.error("There was a problem fetching users: " + error);
    });

  function displayUserList(userContent){
    console.log(userContent);

    const divSecondRow = document.createElement("div");
    classes = ["flex-16", "p-3", "flex", "flex-col", "gap-[.5rem]", "min-h-0", "h-full"];
    divSecondRow.classList.add(...classes);
    // First Column
    const divFC = document.createElement("div");
    classes = ["flex-3", "grid", "grid-cols-5", "gap-5", "max-h-max", "text-primaryColor"];
    divFC.classList.add(...classes);
    if(userContent.length !== 0){
      userContent.forEach(user => {
        const divUserDetailsCntr = document.createElement("div");
        classes = ["p-[.7rem]", "bg-white", "rounded-md"];
        divUserDetailsCntr.classList.add(...classes);

        // Id
        const divUserIdCntr = document.createElement("div");
        const spanIdLbl = document.createElement("span");
        classes = ["font-semibold"];
        spanIdLbl.classList.add(...classes);
        spanIdLbl.textContent = "Id: ";
        divUserIdCntr.appendChild(spanIdLbl);
        const spanId = document.createElement("span");
        spanId.textContent = user.id;
        divUserIdCntr.appendChild(spanId);
        divUserDetailsCntr.appendChild(divUserIdCntr);
        
        // Username
        const divUsernameCntr = document.createElement("div");
        const spanUsernameLbl = document.createElement("span");
        classes = ["font-semibold"];
        spanUsernameLbl.classList.add(...classes);
        spanUsernameLbl.textContent = "Username: ";
        divUsernameCntr.appendChild(spanUsernameLbl);
        const spanUsername = document.createElement("span");
        spanUsername.textContent = user.username;
        divUsernameCntr.appendChild(spanUsername);
        divUserDetailsCntr.appendChild(divUsernameCntr);
        
        const divBtnCntr = document.createElement("div");
        classes = ["flex", "flex-col", "gap-[.3rem]"];
        divBtnCntr.classList.add(...classes);
        const btnView = createDefaultBtn("View");
        btnView.type = "button";
        btnView.addEventListener("click", () => {
          const url = new URL(window.location.href);
          url.searchParams.set("userId", user.id);
          window.history.pushState({}, "", url);

          const body = document.getElementById("body");

          const divViewPop = document.createElement("div");
          classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
          divViewPop.classList.add(...classes);

          const divViewPopupCntr = document.createElement("div");
          classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
          divViewPopupCntr.classList.add(...classes);

          const spanUserDetailTitle = document.createElement("span");
          classes = ["text-3xl", "font-extrabold", "text-primaryColor"];
          spanUserDetailTitle.classList.add(...classes);
          spanUserDetailTitle.textContent = "User Information";
          divViewPopupCntr.appendChild(spanUserDetailTitle);
          
          const formUserDetails = document.createElement("form");
          classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
          formUserDetails.classList.add(...classes);

          // Username
          const divFormUsernameCntr = document.createElement("div");
          const inputUsername = createInputTextNew("user-username", "username", user.username);
          const lblUsername = createLabelNew("Username", "user-username");
          divFormUsernameCntr.appendChild(lblUsername);
          divFormUsernameCntr.appendChild(inputUsername);
          formUserDetails.appendChild(divFormUsernameCntr);

          // Firstname
          const divFormFirstnameCntr = document.createElement("div");
          const inputFirstname = createInputTextNew("user-firstname", "firstname", user.firstname);
          const lblFirstname = createLabelNew("Firstname", "user-firstname");
          divFormFirstnameCntr.appendChild(lblFirstname);
          divFormFirstnameCntr.appendChild(inputFirstname);
          formUserDetails.appendChild(divFormFirstnameCntr);

          // Lastname
          const divFormLastname = document.createElement("div");
          const inputLastname = createInputTextNew("user-lastname", "lastname", user.lastname);
          const lblLastname = createLabelNew("Lastname", "user-lastname");
          divFormLastname.appendChild(lblLastname);
          divFormLastname.appendChild(inputLastname);
          formUserDetails.appendChild(divFormLastname);

          // Address
          const divFormAddress = document.createElement("div");
          const inputAddress = createInputTextNew("user-address", "address", user.address);
          const lblAddress = createLabelNew("Address", "user-address");
          divFormAddress.appendChild(lblAddress);
          divFormAddress.appendChild(inputAddress);
          formUserDetails.appendChild(divFormAddress);
          
          // Name on receipt
          const divFormNameOnReceipt = document.createElement("div");
          const inputNameOnReceipt = createInputTextNew("user-name-on-receipt", "nameOnReceipt", user.nameOnReceipt);
          const lblNameOnReceipt = createLabelNew("Name on receipt", "user-name-on-receipt");
          divFormNameOnReceipt.appendChild(lblNameOnReceipt);
          divFormNameOnReceipt.appendChild(inputNameOnReceipt);
          formUserDetails.appendChild(divFormNameOnReceipt);

          // User Role
          const divFormUserRole = document.createElement("div");
          const selectUserRole = createSelect("user-userrole");
          userRoles.forEach(role => {
            if(user.userRole === role){
              selectUserRole.add(new Option(role, role, true, true));
            }else{
              selectUserRole.add(new Option(role, role));
            }
          });
          const lblUserRole = createLabelNew("User role", "user-userrole");
          divFormUserRole.appendChild(lblUserRole);
          divFormUserRole.appendChild(selectUserRole);
          formUserDetails.appendChild(divFormUserRole);

          const divBtnCntr = document.createElement("div");
          classes = ["col-span-full", "flex", "gap-[.3rem]"];
          divBtnCntr.classList.add(...classes);
    
          const updateBtn = createOkButton("Update");
          updateBtn.type = "button";
          divBtnCntr.appendChild(updateBtn);
    
          const cancelBtn = createCancelBtn("Cancel");
          cancelBtn.type = "button";
          divBtnCntr.appendChild(cancelBtn);
          formUserDetails.appendChild(divBtnCntr);

          updateBtn.addEventListener("click", async () => {
            const username = (inputUsername.value.trim() == "" || inputUsername.value == null) ? "" : inputUsername.value.trim();
            const firstname = (inputFirstname.value.trim() == "" || inputFirstname.value == null) ? "" : inputFirstname.value.trim();
            const lastname = (inputLastname.value.trim() == "" || inputLastname.value == null) ? "" : inputLastname.value.trim();
            const address = (inputAddress.value.trim() == "" || inputAddress.value == null) ? "" : inputAddress.value.trim();
            const nameOnReceipt = (inputNameOnReceipt.value.trim() == "" || inputNameOnReceipt.value == null) ? "" : inputNameOnReceipt.value.trim();
            const userRole = selectUserRole.value;
            const isDefaultUserRoleSelected = selectUserRole.options[selectUserRole.selectedIndex].defaultSelected;
            console.log(isDefaultUserRoleSelected);
            let isValid = false;

            if(username === "" || firstname === "" || lastname === "" || address === "" || nameOnReceipt === ""){
              alert("Please fill in all fields");
              return;
            }

            if(
              username != inputUsername.defaultValue || 
              firstname != inputFirstname.defaultValue || 
              lastname != inputLastname.defaultValue ||
              address != inputAddress.defaultValue ||
              nameOnReceipt != inputNameOnReceipt.defaultValue ||
              !isDefaultUserRoleSelected
            ){
              isValid = true;
            }

            const putUserRequest = {
              username: username,
              address: address,
              firstname: firstname,
              lastname: lastname,
              nameOnReceipt: nameOnReceipt,
              userRole: userRole
            };

            if(isValid){
              await userService.putUser(user.id, putUserRequest)
                .then(response => {
                  if(response.status === 200){
                    const body = document.getElementById("body");
    
                    body.removeChild(divViewPop);
    
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
                .catch(error => {
                  console.error("There was a problem updating a user: " + error);
                });
            }else{
              alert("There were no fields to update.");
              return;
            }
          });

          cancelBtn.addEventListener("click", () => {
            removeParams();
            body.removeChild(divViewPop);
          });

          divViewPopupCntr.appendChild(formUserDetails);
          divViewPop.appendChild(divViewPopupCntr);
          body.appendChild(divViewPop);
        });
        divBtnCntr.appendChild(btnView);

        const btnChangePass = createDefaultBtn("Change password");
        btnChangePass.type = "button"
        btnChangePass.addEventListener("click", () => {
          const url = new URL(window.location.href);
          url.searchParams.set("userId", user.id);
          window.history.pushState({}, "", url);

          const body = document.getElementById("body");

          const divChangePass = document.createElement("div");
          classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryBg", "z-[3]"];
          divChangePass.classList.add(...classes);

          const divChangePassCntr = document.createElement("div");
          classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
          divChangePassCntr.classList.add(...classes);

          const spanUserDetailTitle = document.createElement("span");
          classes = ["text-3xl", "font-extrabold", "text-primaryColor"];
          spanUserDetailTitle.classList.add(...classes);
          spanUserDetailTitle.textContent = "Change Password";
          divChangePassCntr.appendChild(spanUserDetailTitle);
          
          const formChangePassword = document.createElement("form");
          classes = ["flex", "flex-col", "gap-[.5rem]", "text-black"];
          formChangePassword.classList.add(...classes);

          // Old Password
          const divOldPasswordCntr = document.createElement("div");
          const inputOldPassword = createInputPassword("user-old-password", "oldPassword");
          const lblOldPassword = createLabelNew("Old Password", "user-old-password");
          divOldPasswordCntr.appendChild(lblOldPassword);
          divOldPasswordCntr.appendChild(inputOldPassword);
          formChangePassword.appendChild(divOldPasswordCntr);

          // New Password
          const divNewPasswordCntr = document.createElement("div");
          const inputNewPassword = createInputPassword("user-new-password", "newPassword");
          const lblNewPassword = createLabelNew("New Password", "user-new-password");
          divNewPasswordCntr.appendChild(lblNewPassword);
          divNewPasswordCntr.appendChild(inputNewPassword);
          formChangePassword.appendChild(divNewPasswordCntr);

          // Confirm Password
          const divConfirmPasswordCntr = document.createElement("div");
          const inputConfirmPassword = createInputPassword("user-confirm-password", "confirmPassword");
          const lblConfirmPassword = createLabelNew("Confirm Password", "user-confirm-password");
          divConfirmPasswordCntr.appendChild(lblConfirmPassword);
          divConfirmPasswordCntr.appendChild(inputConfirmPassword);
          formChangePassword.appendChild(divConfirmPasswordCntr);

          const divBtnCntr = document.createElement("div");
          classes = ["col-span-full", "flex", "gap-[.3rem]"];
          divBtnCntr.classList.add(...classes);  
          const updateBtn = createOkButton("Update Password");
          updateBtn.type = "button";
          divBtnCntr.appendChild(updateBtn);
          const cancelBtn = createCancelBtn("Cancel");
          cancelBtn.type = "button";
          divBtnCntr.appendChild(cancelBtn);
          formChangePassword.appendChild(divBtnCntr);

          divChangePassCntr.appendChild(formChangePassword);
          divChangePass.appendChild(divChangePassCntr);
          body.appendChild(divChangePass);

          updateBtn.addEventListener("click", async () => {
            const oldPassword = (inputOldPassword.value.trim() == "" || inputOldPassword.value == null) ? "" : inputOldPassword.value.trim();
            const newPassword = (inputNewPassword.value.trim() == "" || inputNewPassword.value == null) ? "" : inputNewPassword.value.trim();
            const confirmPassword = (inputConfirmPassword.value.trim() == "" || inputConfirmPassword.value == null) ? "" : inputConfirmPassword.value.trim();

            if(
              oldPassword == "" ||
              newPassword == "" ||
              confirmPassword == ""
            ){
              alert("Please fill in all fields");
              return;
            }

            if(newPassword != confirmPassword){
              alert("New password & confirm password does not match");
              return;
            }

            const changePasswordRequest = {
              oldPassword: oldPassword,
              newPassword: newPassword
            };

            await userService.putChangePassword(user.id, changePasswordRequest)
              .then(response => {
                if(response.status === 204){
                  const body = document.getElementById("body");
    
                  body.removeChild(divChangePass);
  
                  const divEditedPopup = document.createElement("div");
                  classes = ["flex", "justify-center", "items-center", "absolute", "w-full", "h-full", "bg-secondaryBg/50", "text-primaryColor", "z-[3]"];
                  divEditedPopup.classList.add(...classes);
  
                  const divEditedPopupCntr = document.createElement("div");
                  classes = ["flex", "flex-col", "gap-[.6rem]", "w-[30%]", "h-max","bg-primaryBg", "p-2", "rounded-md", "shadow-md"];
                  divEditedPopupCntr.classList.add(...classes);
  
                  const h1Title = document.createElement("h1");
                  classes = ["text-3xl", "font-extrabold"];
                  h1Title.classList.add(...classes);
                  h1Title.textContent = "Password edited successfully!";
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
              .catch(error => {
                console.error("There was a problem changing of password: " + error);
              });
          });

          cancelBtn.addEventListener("click", () => {
            removeParams();
            body.removeChild(divChangePass);
          });
        });
        divBtnCntr.appendChild(btnChangePass);

        const btnDelete = createDeleteBtn();
        btnDelete.type = "button";
        btnDelete.addEventListener("click", () => {
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

          btnOk.addEventListener("click", async () => {
            const url = new URL(window.location.href);
            url.searchParams.set("userId", user.id);
            window.history.pushState({}, "", url);

            await userService.deleteUser(user.id)
              .then(response => {
                if(response.status === 204){
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
                }else{
                  console.error("Unhandled status code: " + response.status);
                }
              })
              .catch(error => {
                console.error("There was a problem during deletion: " + user);
              });
          });

          btnCancel.addEventListener("click", () => {
            body.removeChild(divConfirmationPopup);
          });
        });
        divBtnCntr.appendChild(btnDelete);

        divUserDetailsCntr.appendChild(divBtnCntr);
        divFC.appendChild(divUserDetailsCntr);
      });
    }else{
      const spanNoContent = document.createElement("span");
      spanNoContent.textContent = "No users";
      divFC.appendChild(spanNoContent);
    }

    divSecondRow.appendChild(divFC);
    section.appendChild(divSecondRow);
    container.appendChild(section);
  }
}