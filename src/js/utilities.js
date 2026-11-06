import { authService } from "./services/authservice";

const INPUT_STYLE = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]", "outer"];

export async function processCreds(creds){
  const response = await authService.login(creds);
  return response;
}

// BUTTONS
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

export function createDeleteBtn(text){
  const deleteBtn = document.createElement("button");
  const classes = ["w-full", "bg-errorAlert", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-errorAlert/50"];
  deleteBtn.classList.add(...classes);
  deleteBtn.textContent = "Delete";

  return deleteBtn;
}
// BUTTONS

// FORMS TAG
export function createInputText(){
  let createInputText = document.createElement("input");
  createInputText.classList.add(...INPUT_STYLE);
  createInputText.type = "text";

  return createInputText;
}

export function createInputTextNew(inputId, inputName, value){
  const input = document.createElement("input");
  input.classList.add(...INPUT_STYLE);
  input.id = inputId;
  input.name = inputName;
  input.type = "text";
  input.autocomplete = "off";
  if(value != null){
    input.value = value;
    input.defaultValue = value;
  } 
  return input;
}

export function createInputPassword(inputId, inputName){
  const input = document.createElement("input");
  input.classList.add(...INPUT_STYLE);
  input.id = inputId;
  input.name = inputName;
  input.type = "password";
  input.autocomplete = "off";

  return input;
}

export function createLabelNew(lblTitle, lblFor){
  let lbl = document.createElement("label");
  const classes = ["text-primaryColor", "font-extrabold"];
  lbl.classList.add(...classes);
  lbl.textContent = lblTitle;
  lbl.setAttribute("for", lblFor);

  return lbl;
}

export function createSelect(selectId){
  const select = document.createElement("select");
  const classes = ["w-full", "px-[.3rem]", "border-[.2rem]", "rounded-md", "border-primaryColor", "outline-[0]"];
  select.classList.add(...classes);
  select.id = selectId;

  return select;
}
// FORMS TAG

export function createDefaultBtn(text){
  const defaultBtn = document.createElement("button");
  defaultBtn.textContent = text;
  const classes = ["w-full", "bg-primaryColor", "text-primaryBg", "font-bold", "rounded-md", "py-[.2rem]", "cursor-pointer", "hover:bg-secondaryBg", "hover:text-primaryColor"];
  defaultBtn.classList.add(...classes);

  return defaultBtn;
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