$(document).ready(function(){    
    loadAllNotifications();
    $('#dismiss-all').click(onClickDismissAll);
});

const onClickDismissAll = (e) => {
    e.preventDefault();
    const notificationCards = document.querySelectorAll('.notification-card');
    let html = `<h4 class="text-center">All caught up!</h4>`;
    $('#notification_listing').html(html);
    $('#dismiss-all').hide();
}

const loadAllNotifications = async() => {
    const loggedUser = loginUser.user_id;
    const getNotification = await makeRequest(`api/notifications/all`,"POST",{user_id : loggedUser});
    const notify_array = getNotification.result;
    // console.log(notify_array); return 0;
    if(getNotification.result.length > 0){        
        let html = "";        
        $(notify_array).each((index,data) => {
            let dp = `/img/profile_picture.png`;
            if(data.sender_dp){
                dp = `/img/uploads/${data.sender_dp}`;
            }
            html += `<div class="card notification-card notification-invitation">
                        <div class="card-body">
                            <table>
                            <tr>
                                <td style="width:70%">
                                    <div class="card-title">
                                            <img class="img-fluid chatAvatar"
                                            src="${dp}"
                                            alt="user img">
                                            ${data.notification_message}
                                    </div>
                                </td>
                                <td style="width:30%">
                                    <a style="color: #fff;text-decoration: none;" class="btn btn-danger"><i class="fa-regular fa-eye"></i> Read</a>                                       
                                </td>
                            </tr>
                            </table>
                        </div>
                    </div>`;
        });
        $('#notification_listing').append(html);
    }else{
        const notificationCards = document.querySelectorAll('.notification-card');
        let html = `<h4 class="text-center">All caught up!</h4>`;
        $('#notification_listing').html(html);
        $('#dismiss-all').hide();
    }
};