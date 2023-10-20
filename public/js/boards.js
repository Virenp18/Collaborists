$(document).ready(function () {
  $("#addBoardFrom").submit(onAddBoardSubmit);

  const emailIds = ["ankitamalik@gmail.com", "viren@gmail.com", "farhein@gmail.com", "ankita406@gmail"];
  const searchInput = document.getElementById("searchInput");
  const suggestionsContainer = document.getElementById("emailOptions");
  const invitedEmailList = document.getElementById("invitedEmailList");
  const inviteButton = document.getElementById("inviteButton");
  const shareButton=document.getElementById("sharebutton")

  searchInput.addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase();
    suggestionsContainer.innerHTML = ""; // Clear previous suggestions

    emailIds.forEach((emailId) => {
      if (emailId.toLowerCase().includes(searchQuery)) {
        const suggestion = document.createElement("div");
        suggestion.textContent = emailId;
        suggestion.classList.add("emailOptions");
        suggestion.addEventListener("click", function () {
          searchInput.value = emailId; // Fill input with the selected suggestion
          suggestionsContainer.innerHTML = ""; // Clear suggestions
        });

        suggestionsContainer.appendChild(suggestion);
      }
    });
  });
  
// Function to add the selected email to the Invited Email List
function AddEmail(email) {
  const invitedEmailElement = createInvitedEmailElement(email);
  invitedEmailList.appendChild(invitedEmailElement);
  searchInput.value = ""; // Clear the input field after inviting
  suggestionsContainer.innerHTML = ""; // Clear the suggestions
}

  inviteButton.addEventListener("click", function () {
    const selectedEmail = searchInput.value;
    if (selectedEmail) {
      AddEmail(selectedEmail);
    }
  });

  shareButton.addEventListener("click", function () {
    const selectedEmail = searchInput.value;
    if (selectedEmail) {
      shareMail(selectedEmail);
    }
  });
});

const onAddBoardSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const jsonData = Object.fromEntries(formData.entries());
  const result = await makeRequest(`api/boards/addBoard`, "POST", jsonData);

  if (!hasError(result, "loginError")) {
    window.location.href = '/pages/boards';
  }
  return false;
};

// Create a function to create a new invited email element
function createInvitedEmailElement(email) {
  const invitedEmailElement = document.createElement("li");
  invitedEmailElement.classList.add("invited-email");

  const emailPermissionsDiv = document.createElement("div");
  emailPermissionsDiv.classList.add("email-permissions-container");

  const emailLink = document.createElement("li");
  emailLink.textContent = email;
  emailLink.classList.add("email-link");

  const permissionsSelect = document.createElement("select");
  permissionsSelect.classList.add("permissions-select");
  permissionsSelect.innerHTML = `
      <option value="Edit">Edit</option>
      <option value="View">View</option>
      <option value="Delete">Delete</option>
    `;

  emailPermissionsDiv.appendChild(emailLink);
  emailPermissionsDiv.appendChild(permissionsSelect);
  invitedEmailElement.appendChild(emailPermissionsDiv);

  return invitedEmailElement;
}

function shareMail(email) {
  const invitedEmailElement = document.createElement("li");
  invitedEmailElement.textContent = email;
  invitedEmailList.appendChild(invitedEmailElement);
  searchInput.value = ""; // Clear the input field after inviting
  suggestionsContainer.innerHTML = ""; // Clear the suggestions
}
