import { authService } from "./services/authservice";

export async function processCreds(creds){
  const response = await authService.login(creds);
  return response;
}

export function createOkButton(text){
  let createOkBtn = document.createElement("button");

  if(text == null || text == "")
    createOkBtn.textContent = "OK";
  else
    createOkBtn.textContent = text;
  const classes = ["p-2", "rounded-md", "bg-sucessConfirm", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-sucessConfirm/50"];
  createOkBtn.classList.add(...classes);

  return createOkBtn;
}

export function createCancelBtn(text){
  let createCancelBtn = document.createElement("button");

  if(text == null || text == "")
    createCancelBtn.textContent = "Cancel";
  else
    createCancelBtn.textContent = text;
  const classes = ["p-2", "rounded-md", "bg-errorAlert", "cursor-pointer", "text-primaryBg", "w-full", "hover:bg-errorAlert/50"];
  createCancelBtn.classList.add(...classes);

  return createCancelBtn;
}

export function createInputText(){
  let createInputText = document.createElement("input");
  const classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "outer"];
  createInputText.classList.add(...classes);
  createInputText.type = "text";

  return createInputText;
}

export function createLabel(text){
  let createLabel = document.createElement("label");
  const classes = ["text-primaryColor", "font-extrabold"];
  createLabel.classList.add(...classes);

  createLabel.textContent = text;
  createLabel.for = text.replace(" ", "-").toLowerCase();

  return createLabel;
}

export function removeParams(){
  const url = new URL(window.location.href);
  const newUrl = url.origin + "/landingpage";
  window.history.replaceState({}, "", newUrl);
}  