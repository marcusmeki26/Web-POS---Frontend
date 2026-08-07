import { processCreds } from "./utilities";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const userId = document.getElementById("user-id").value.trim();
  const userPass = document.getElementById("user-password").value.trim();

  // if (!username || !password) { // Commented since there is still no backend
  //   alert('Please fill in all fields.');
  //   return;
  // }

  processCreds({userId, userPass});
});