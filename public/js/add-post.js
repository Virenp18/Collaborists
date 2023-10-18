$(document).ready(function(){
    $("#addBoardPin").submit(onAddBoardPin);
});
const onAddBoardPin = async (event) => {
    event.preventDefault();
    
  
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());  
    const result = await makeRequest(`api/boards/addBoardPin`, "POST", jsonData);
  
    // if (!hasError(result, "loginError")){
    //   window.location.href = '/pages/boards';
    // }  
    // return false;
  };