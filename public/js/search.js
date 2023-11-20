$(document).ready(function(){
    $("#searchString").val(getSearchString());
    loadUsers(getSearchString())
});

const loadUsers = async(searchValue) => {
    const getUsers = await makeRequest(`api/users/searchAll`,"POST",{
        searchValue : searchValue,
        loginUserID : loginUser.user_id
    });
    // console.log(getUsers.results.length);
    if (getUsers.results.length > 0) {
        const userDetail = getUsers.results;
        let dp = `/img/profile_picture.png`;
        let userListHTML = "";
        $(userDetail).each(function (index, element) {
            if(element.profile_picture){
                dp = `/img/uploads/${element.profile_picture}`;
            }
            userListHTML += `<a href="/pages/profile/${element.user_id}" class="list-group-item d-flex justify-content-between align-items-center list-group-item-action">
                                <div>
                                    <img class="img-fluid chatAvatar"
                                    src="${dp}"
                                    alt="user img"> ${element.username}
                                </div>
                                <span class="badge badge-danger badge-pill"><i class="fas fa-plus"></i> Follow</span>
                            </a>`;
        });
        $('#user_listing').append(userListHTML);
    }
};
/**
 * Util Section
 * Util methods to handle page specific logic
 */
const getSearchString = () =>{
    const urlParts = window.location.pathname.split("/");
    const idIndex = urlParts.indexOf("search") + 1;  
    return urlParts[idIndex];
};
