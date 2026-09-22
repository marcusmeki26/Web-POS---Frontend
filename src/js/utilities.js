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