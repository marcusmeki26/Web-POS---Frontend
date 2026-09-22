import { processCreds } from "./utilities";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById("user-id").value.trim();
  const password = document.getElementById("user-password").value.trim();

  if (!username || !password) { 
    alert('Please fill in all fields.');
    return;
  }

  await processCreds({username, password});
});