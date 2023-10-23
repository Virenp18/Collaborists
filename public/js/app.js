$(document).ready(function(){
    const loginUser = null;
    checkLocalStorage();
    fetchBookDetails();

    $('[data-toggle="tooltip"]').tooltip();
    $('#navlogoutButton').click(onDoubleClickProfile);
    $('#navProfileBtn').click(profileBtnClick);
});

const onDoubleClickProfile = (event) => {
    window.localStorage.removeItem("collaborist@authentication");
    window.location.href = "/pages/login";
}
const profileBtnClick = (event) => {
    window.location.href = "/pages/profile/" + loginUser.user_id;
}

const fetchBookDetails = async() => {
    const userId = loginUser.user_id;
    const userDetails = await makeRequest(`api/users/${userId}`, "GET");
    console.log("hello => ",userDetails.results);

    $('#nav_image_logo').attr('src',`/img/uploads/${userDetails.results.profile_picture}`);
}
/**
 * Util Section
 * Util methods to handle page specific logic
 */

function checkLocalStorage(){
    let userInfo = window.localStorage.getItem("collaborist@authentication");
    if(userInfo){
        userInfo = JSON.parse(userInfo);
        loginUser = userInfo.results[0];
        $('.user_id').val(loginUser.user_id);
        $('.isLogin').show();
        $('#navUserName').html(`${loginUser.username}`);
        $('.notLogin').hide();
        
    }else{
        $('.isLogin').hide();
        $('.notLogin').show();
        $('.user_id').val('');

    }
    return false;
}

