const projBasePath = import.meta.env.VITE_ROOT_PROJECT_PATH; 

function processCreds({ username, password }){
  // Go to landingpage.html after correct validation

  window.location.href = `${projBasePath}/landingpage`;
}

export { processCreds };