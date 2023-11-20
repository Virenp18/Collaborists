$(document).ready(function(){
    checkLocalStorage();
    if(getUserFromUrl()){
        makeChatFromUrl();
    }
    getSocketMessages();
    $('#sendMessageToUser').click(onSendingMessage);
});
const socket = io();

const makeChatFromUrl = async() => {
    // in this we will take care that if a user is already there in our DB then we will just load the chat else we will make a chat
    let user_id = getUserFromUrl();
    let logged_user_id = loginUser.user_id; 
    if(user_id){
        // get the details of user you want to chat
        const get_user_details = await makeRequest(`api/users/${user_id}`);
        if(get_user_details.results){
            makeChatPersonPane(get_user_details.results);
            // check if they have a prior messages
            const result = await makeRequest(`api/chats/${user_id}`,'POST',{logged_user_id : logged_user_id});
            if (result.user_chats.length > 0) {
                // then call an api to load show the chats on screen with help of chat_id
                const chat_id = result.user_chats[0].chat_id;
                const getAllMsgs = await makeRequest(`api/chats/getAllChatMessages`,"POST",{chat_id : chat_id});
                // now show all the messages here
                if(getAllMsgs.data.length > 0){
                    let getpreviousChatHTML = ``;
                    $(getAllMsgs.data).each(function (index, element) {
                        const now = new Date(element.created_at);
                        const getSendingTime = get12HourTime(now);
                        if (element.sender_user_id == logged_user_id) {                            
                            getpreviousChatHTML += `<li class="repaly">
                                                        <p> ${element.message} </p>
                                                        <span class="time">${getSendingTime}</span>
                                                    </li>`;
                        }else{
                            getpreviousChatHTML += `<li class="sender">
                                                        <p> ${element.message} </p>
                                                        <span class="time">${getSendingTime}</span>
                                                    </li>`;
                        }
                    });
                    $('.showMessage').find('.divider').hide();
                    $('.showMessage').find('ul').append(getpreviousChatHTML);
                }else{
                    $('.showMessage').find('ul').html(`<div class="divider"><h6>Say Hi!! <i class="fa-regular fa-hand"></i></h6></div>`);
                }
            }else{
                $('.showMessage').find('ul').html(`<div class="divider"><h6>Say Hi!! <i class="fa-regular fa-hand"></i></h6></div>`);
            }
        }
        
    }
    return false;
};

const makeChatPersonPane = (info) => {
    let dp = `/img/profile_picture.png`;
    if(info.profile_picture){
        dp = `/img/uploads/${info.profile_picture}`;
    }
    let chatpaneHTML = `<a href="#" class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <img class="img-fluid chatAvatar"
                                    src="${dp}"
                                    alt="user img">
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h3>${info.username}</h3>
                                
                            </div>
                        </a>`;
                        
    const chatUser_HTML = `<div class="flex-shrink-0">
                            <img class="img-fluid chatAvatar"
                                    src="${dp}"
                                    alt="user img">
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h3>${info.username}</h3>
                            </div>`;
    $('#ChatUserHeader').html(chatUser_HTML);
    $('.chat-list').append(chatpaneHTML);
    $('.showMessage').show();
    $('.noMessages').hide(); 
}

const onSendingMessage = async() => {
    const message = $("#text_message_outgoing").val();
    const now = new Date();
    const getSendingTime = get12HourTime(now);
    const chat_msg_HTML= `<li class="repaly">
                            <p> ${message} </p>
                            <span class="time">${getSendingTime}</span>
                          </li>`;
    let user_id = getUserFromUrl();
    const get_user_details = await makeRequest(`api/users/${user_id}`);
    if(get_user_details){
        let dp = `/img/profile_picture.png`;
        if(get_user_details.results.profile_picture){
            dp = `/img/uploads/${get_user_details.results.profile_picture}`;
        }
        const chatUser_HTML = `<div class="flex-shrink-0">
                                    <img class="img-fluid chatAvatar"
                                        src="${dp}"
                                        alt="user img">
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h3>${get_user_details.results.username}</h3>
                                </div>`;
        $('#ChatUserHeader').html(chatUser_HTML);
        $('.showMessage').find('ul').append(chat_msg_HTML);
        $('.showMessage').find('.divider').hide();
        // as soon as you have sent the message now we will call the api where we will insert in the db
        const saveChatData = {
            fromUser : loginUser.user_id,
            toUser : user_id
        };
        let chat_id = ``;
        //check if there was a chat already with this person in db
        const checkChatExist = await makeRequest(`api/chats/${user_id}`,'POST',{logged_user_id : loginUser.user_id});
        //if its new chat then data will enter in user_chats db 
        if(checkChatExist.user_chats.length == 0){
            const chatData = await makeRequest(`api/chats/saveChatUser`,'POST',saveChatData);
            chat_id = chatData.chat_id;
        }else{
            chat_id = checkChatExist.user_chats[0].chat_id;
        }   
        
        // else we will save the chat in db
        // call the api to save the chat in chat_messages db
        const save_msg = await makeRequest(`api/chats/user/savechat`,'POST',
        {
            chat_id : chat_id,
            sender_user_id : loginUser.user_id,
            message : message
        }
        ); 
        $('#text_message_outgoing').val('');
        $('.showMessage').show();
        $('.noMessages').hide(); 
    }
    return 0;       
};

const getSocketMessages = async() => {
    socket.on('new-message', (data) => {
        const getLoggedUser = getUserFromUrl();
        const getSentMsgUID = data.sender_user_id;
        const now = new Date();
        const getSendingTime = get12HourTime(now);
        const replyChatHTML = `<li class="sender">
                                    <p>${data.message}</p>
                                    <span class="time">${getSendingTime}</span>
                                </li>`;
        if(getLoggedUser == getSentMsgUID){
            $('.showMessage').find('ul').append(replyChatHTML);
            $('.showMessage').show();
            $('.showMessage').find('.divider').hide();
        }
    });
}

/**
 * Util Section
 * Util methods to handle page specific logic
 */
const getUserFromUrl = () => {
    const urlParts = window.location.pathname.split("/");
    const idIndex = urlParts.indexOf("messages") + 1;  
    return urlParts[idIndex];
  }
const formatDate = (dateString) => {
    const inputDateString = dateString;
    const date = new Date(inputDateString);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}