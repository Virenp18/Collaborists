$(document).ready(function(){
    fetchProfileDetails();
    getAllUploadedPins();
});

const getAllUploadedPins = async() => {
    const userId = getUserFromUrl();
    const userDetails = await makeRequest(`api/posts/${userId}`, "GET");
    let appendedHtml = "";
    if(userDetails.data.length > 0){
        $(userDetails.data).each(function (index, element) {
            appendedHtml += `<div class="card border-white">
                            <a href="/pages/singlePost">
                                <img class="card-img-top rounded-conrners preview"
                                    src="/img/posts/${element.url}" alt="${element.url}">
                            </a>
                            <div class="card-footer d-flex justify-content-between"
                                style="background-color: transparent; border-top : none;">
                                <p class="h4 text-secondary">${element.description}</p>
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