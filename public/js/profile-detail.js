$(document).ready(function(){
    checkLocalStorage();
    isLoggedUser();
    fetchProfileDetails();
    checkLoginUserFollowing().then((value) => {
        if(value){
            // if the login user is following the searched user then change the HTML
            followingHTML();
        }
    })
    getAllUploadedPins();
    
    $('#followOption').click(toggleFollowingBtn);
    $('#messageUser').click((event) =>{
        const user_id = getUserFromUrl();
        window.location.href = "/pages/messages/" + user_id;
    });
    socket.on('new-follower', (data) => {
        if(loginUser.user_id == data.followed_user_id){
            let nav_notify_html = `<i class="fas fa-bell fa-shake nav-mobile"></i>
                                    <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                        <span class="visually-hidden">New alerts</span>
                                    </span>`;
            $("#nav_notification").addClass('position-relative');
            $("#nav_notification").html(nav_notify_html);
            $('.toast-body').html(`You have been followed by ${data.follower_name}`);
            toast.show();
        }
    });
});

const getAllUploadedPins = async() => {
    const userId = getUserFromUrl();
    const userDetails = await makeRequest(`api/posts/${userId}`, "GET");
    let appendedHtml = "";
    if(userDetails.data.length > 0){
        $(userDetails.data).each(function (index, element) {
            appendedHtml += `<div class="card border-white">
                            <a href="/pages/singlePost/${element.project_id}">
                                <img class="card-img-top rounded-conrners preview"
                                    src="/img/posts/${element.url}" alt="${element.url}">
                            </a>
                            <div class="card-footer d-flex justify-content-between"
                                style="background-color: transparent; border-top : none;">
                                <p class="h4 text-secondary">${element.title}</p>
                                <button type="button" data-toggle="tooltip" data-placement="top" title="${element.description}"
                                    data-html="true" class="btn btn-link">
                                    <i class="fa fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>`;        
        });
        $("#uploadedPins").html(appendedHtml);        
        $('#uploadedPins').show();        
    }else{
        $('#noPinsUploaded').show();     
    }
};

const fetchProfileDetails = async() => {
    const userId = getUserFromUrl();
    const userDetails = await makeRequest(`api/users/${userId}`, "GET");
    
    if(userDetails.results.likes_count){
        $('#likes_count').html(userDetails.results.likes_count);
    }else{
        $('#likes_count').html("0");
    }

    if(userDetails.results.followers_count){
        $('#follower_count').html(userDetails.results.followers_count);
    }else{
        $('#follower_count').html("0");
    }

    if(userDetails.results.username){
        $('#profile_uname').html(userDetails.results.username);
    }else{
        $('#profile_uname').html("Test");
    }

    if(userDetails.results.profile_picture){
        $('#profile_pic').attr('src',`/img/uploads/${userDetails.results.profile_picture}`);
    }else{
        $('#profile_pic').attr('src',`/img/profile_picture.png`);
    }

    if(userDetails.results.created_at){
        const formattedIncrementedDate = formatDate(userDetails.results.created_at);
        $('#user_joined').html(`Joined : ${formattedIncrementedDate}`);
    }else{
        $('#user_joined').html(`Joined : -`);
    }
}

const isLoggedUser = async() => {
    const userId = getUserFromUrl();
    let userInfo = window.localStorage.getItem("collaborist@authentication");
    if(userInfo){
        userInfo = JSON.parse(userInfo);
        if(userId == userInfo.results[0].user_id){
            $("#editAvatarBtn").show();
            $("#editMotoBtn").show();
            $("#messageUser").hide();
            $("#followOption").hide();

        }else{
            $("#messageUser").show();
            $("#followOption").show();
            $("#editAvatarBtn").hide();
            $("#editMotoBtn").hide();
        }
    }else{
        $("#editAvatarBtn").hide();
        $("#editMotoBtn").hide();
    }
}
const checkLoginUserFollowing = async() => {
    let isFollowing = false;
    const getLoginUserDetails = loginUser;
    if (getLoginUserDetails) {
        const loginUser = getLoginUserDetails.user_id;
        // call the API through login user to the search user you want to follow
        const getfollowedUser = getUserFromUrl();
        const checkUserFollowingAlready = await makeRequest(`api/users/checkUserFollowing`, "POST",{
            follower_user : loginUser,
            followed_user : getfollowedUser
        });
        if (checkUserFollowingAlready.results.length > 0) {
            isFollowing = true;
        }else{
            isFollowing = false;
        }
    }
    return isFollowing;
}
const followingHTML = () =>{
    const foll_HTML = `<i class="fa-solid fa-user-group"></i> Following`;
    $("#followOption").removeClass('btn-outline-primary');
    $("#followOption").addClass('btn-outline-success following');
    $('#followOption').html(foll_HTML);
};
const toggleFollowingBtn = async() => {
    const checkIsFollowing = $('#followOption').hasClass('following');
    if(!checkIsFollowing){
        // now call the API where you will follow the user 
        const addFollower = await makeRequest(`api/users/addFollowerRelation`,"POST",{
            follower_user : loginUser.user_id,
            followed_user : getUserFromUrl()
        });
        if(addFollower.status == "success"){
            followingHTML();
            // add socket
            sendNotifictaion();           
            
        }
    }else{
        // call the API where you will delete the record from db
        const deleteFollower = await makeRequest(`api/users/deleteFollowing`,"POST",{
            follower_user : loginUser.user_id,
            followed_user : getUserFromUrl()
        });
        if(deleteFollower.status == 'success'){
            const unfoll_HTML = `<i class="fa-solid fa-user-plus"></i> Follow`;
            //if login user is following make the the html to unfollow
            $("#followOption").removeClass('btn-outline-success following');
            $("#followOption").addClass('btn-outline-primary');
            $('#followOption').html(unfoll_HTML);
        }        
    }
}
const sendNotifictaion = async() => {
    const io_data = {
        followed_user_id : getUserFromUrl(),
        follower_name: loginUser.username
    }
    // insert the notification to db
    const addNotifictaion = await makeRequest(`api/notifications/addNotifications`, "POST", {
        user_id : io_data.followed_user_id,
        user_send : loginUser.user_id,
        notification_type : "FOLLOWER",
        notification_message : `You have been followed by ${loginUser.username}`,
        is_read : false
    });
    if(addNotifictaion.status == "success"){
        // send the emit to server and back from server
        socket.emit('new-follower-send',io_data);
    }
}
/**
 * Util Section
 * Util methods to handle page specific logic
 */

const getUserFromUrl = () => {
    const urlParts = window.location.pathname.split("/");
    const idIndex = urlParts.indexOf("profile") + 1;  
    return parseInt(urlParts[idIndex]);
}
const formatDate = (dateString) => {
    const inputDateString = dateString;
    const date = new Date(inputDateString);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}
