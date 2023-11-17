$(document).ready(function(){
    checkLocalStorage();
    isLoggedUser();
    fetchProfileDetails();
    getAllUploadedPins();

    $('#messageUser').click((event) =>{
        const user_id = getUserFromUrl();
        window.location.href = "/pages/messages/" + user_id;
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

        }else{
            $("#messageUser").show();
            $("#editAvatarBtn").hide();
            $("#editMotoBtn").hide();
        }
    }else{
        $("#editAvatarBtn").hide();
        $("#editMotoBtn").hide();
    }
}

/**
 * Util Section
 * Util methods to handle page specific logic
 */

const getUserFromUrl = () => {
    const urlParts = window.location.pathname.split("/");
    const idIndex = urlParts.indexOf("profile") + 1;  
    return urlParts[idIndex];
  }
const formatDate = (dateString) => {
    const inputDateString = dateString;
    const date = new Date(inputDateString);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}
