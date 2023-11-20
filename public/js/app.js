$(document).ready(function(){
    const loginUser = null;
    checkLocalStorage();
    fetchUserDetails();
    if(getPartFromUrl() !== "notifications"){
        checkNotifications();
    }    

    $('[data-toggle="tooltip"]').tooltip();
    $('#navlogoutButton').click(onLogoutClick);
    $('#navProfileBtn').click(profileBtnClick);
    $("#searchString").keypress(onEnterSearch);
});

const onLogoutClick = (event) => {
    window.localStorage.removeItem("collaborist@authentication");
    window.location.href = "/pages/login";
}
const profileBtnClick = (event) => {
    window.location.href = "/pages/profile/" + loginUser.user_id;
}

const fetchUserDetails = async() => {
    if(loginUser){
        const userId = loginUser.user_id;
        const userDetails = await makeRequest(`api/users/${userId}`, "GET");
        if(userDetails.results.profile_picture){
            $('#nav_image_logo').attr('src',`/img/uploads/${userDetails.results.profile_picture}`);
        }else{
            $('#nav_image_logo').attr('src',`/img/profile_picture.png`);
        }
    }
}
const onEnterSearch = (e) => {
    const searchValue = $("#searchString").val();
    if(e.key == "Enter" && searchValue !== ""){        
        window.location.href = "/pages/search/" + searchValue;
    }
}

const checkNotifications = async() => {
    const loggedUserID = loginUser.user_id;
    if(loggedUserID) {
        // get all the notifications which are not read and of logged in user
        const getAllNotifications = await makeRequest(`api/notifications/all`,"POST",{user_id : loggedUserID});
        if(getAllNotifications.result.length > 0){
            notificationOn();
        }
    }
}
const notificationOn = () => {
    const nav_notify_html = `<i class="fas fa-bell nav-mobile"></i>
                                    <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                        <span class="visually-hidden">New alerts</span>
                                    </span>`;
    $("#nav_notification").addClass('position-relative');
    $("#nav_notification").html(nav_notify_html);    
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
const getPartFromUrl = () => {
    const urlParts = window.location.pathname.split("/");
    const idIndex = urlParts.indexOf("pages") + 1;  
    return urlParts[idIndex];
}

