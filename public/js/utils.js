const makeRequest = async (url, method = "GET", body = null) => {
  const requestOptions = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method.toLowerCase() !== "get" && body != null) {
    requestOptions.body = JSON.stringify(body);
  }

  return await fetch(`${API_BASE_URL}/${url}`, requestOptions).then((result) => result.json());
};

// Check if the request result returned 200
// Otherwise set the error message in the given nodeId
const hasError = (result, nodeId) => {
  if (result.status == "error") {
    $(`#${nodeId}`).html(result.message);
    $(`#${nodeId}`).show();

    return true;
  }

  return false;
};

const success = (result, nodeId) => {
  if (result.status != "error") {
    $(`#${nodeId}`).html("Successfully registered! Redirecting to Login.....");
    $(`#${nodeId}`).show();

    return true
  }

  return false;
};



// Check if the user is logged and has an Admin role
const isLoggedUserAdmin = () => {
  let userInfo = window.localStorage.getItem("bookshelf@authentication");

  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    return userInfo.role == "admin";
  }
  
  return false;
};

function get12HourTime(date) {
  if (!(date instanceof Date)) {
    throw new Error('Invalid Date object provided');
  }

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 12 should be displayed as 12, not 0

  // Add leading zero to minutes if needed
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Construct the 12-hour time format string
  const timeString = `${hours}:${minutes} ${ampm}`;

  return timeString;
}
