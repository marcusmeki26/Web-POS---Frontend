import { authService } from "./services/authservice";

const projBasePath = import.meta.env.VITE_ROOT_PROJECT_PATH; 

export async function processCreds(creds){
  const response = await authService.login(creds);

  if(response.status == 200){
    // Go to landingpage.html after correct validation
    // sessionStorage.setItem("active-tab", "menu");
    window.location.href = `${projBasePath}/landingpage`;
  }
}

export function createOkButton(){
  let createOkBtn = document.createElement("button");
  createOkBtn.textContent = "OK";
  const classes = ["p-2", "rounded-md", "bg-sucessConfirm", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-sucessConfirm/50"];
  createOkBtn.classList.add(...classes);

  return createOkBtn;
}

export function createCancelBtn(){
  let createCancelBtn = document.createElement("button");
  createCancelBtn.textContent = "Cancel";
  const classes = ["p-2", "rounded-md", "bg-errorAlert", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-errorAlert/50"];
  createCancelBtn.classList.add(...classes);

  return createCancelBtn;
}

export function removeParams(){
  const url = new URL(window.location.href);
  const newUrl = url.origin + "/landingpage";
  window.history.replaceState({}, "", newUrl);
}  