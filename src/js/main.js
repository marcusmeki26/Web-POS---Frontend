import { processCreds } from "./utilities";

const loginForm = document.getElementById("login-form");
const projBasePath = import.meta.env.VITE_ROOT_PROJECT_PATH; 

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById("user-id").value.trim();
  const password = document.getElementById("user-password").value.trim();

  if (!username || !password) { 
    alert('Please fill in all fields.');
    return;
  }

  await processCreds({username, password})
    .then(response => {
      if(response.status == 200 || response.status == 201){
        window.location.href = `${projBasePath}/landingpage`;
      }
    })
    .catch(error => {
      alert(`${error.response.data.code}\n
                ${error.response.data.message}`);
      // alert(error);
    });
});