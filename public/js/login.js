$(document).ready(function () {
    $("#loginUserForm").submit(onLoginSubmit);
    $("#addNewUserForm").submit(onRegisterSubmit);
  });

  const onRegisterSubmit = async (event) => {
    event.preventDefault();  
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());
    // console.log(jsonData);    
    const result = await makeRequest(`api/users/register`, "POST", jsonData);
    // If no erro in registering
    if (!hasError(result, "loginError")){
        window.location.href = '/pages/login';
    }
    return false;
  }

  const onLoginSubmit = async (event) => {
    event.preventDefault();  
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());
    // console.log(jsonData);    
    const result = await makeRequest(`api/users/login`, "POST", jsonData);
    console.log(result);
    // If no erro in registering
    if (result.status == 'success'){
        window.localStorage.setItem("collaborist@authentication", JSON.stringify(result));
        window.location.href = '/';
    }
    return false;
  }