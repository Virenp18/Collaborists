$(document).ready(function () {
    $("#addBoardFrom").submit(onAddBoardSubmit);
});

const onAddBoardSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());  
    const result = await makeRequest(`api/boards/addBoard`, "POST", jsonData);
  
    if (!hasError(result, "loginError")){
      window.location.href = '/pages/boards';
    }  
    return false;
  };