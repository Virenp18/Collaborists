$(document).ready(function(){
    fetchUserDetails();
});

const fetchUserDetails = async() => {
    const userId = getUserFromUrl();
    const userDetails = await makeRequest(`api/users/${userId}`, "GET");
    console.log(userDetails.results);
    $('#profile_uname').html(userDetails.results.username);
    $('#profile_pic').attr('src',`/img/uploads/${userDetails.results.profile_picture}`);
    $('#nav_image_logo').attr('src',`/img/uploads/${userDetails.results.profile_picture}`);
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