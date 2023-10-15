$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    var dropdownList = dropdownElementList.map(function (dropdownToggle) {
        return new bootstrap.Dropdown(dropdownToggle);
    });
    

    


    const emailIds = ["ankitamalik@gmail.com", "viren@gmail.com","farhein@gmail.com","ankita406@gmail.com"];
    const searchInput = document.getElementById("searchInput");
    const suggestionsContainer = document.getElementById("emailOptions");
    const clearButton = document.getElementById("clearButton");
    searchInput.addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase();
    suggestionsContainer.innerHTML = ""; 
    // Clear previous suggestions
    emailIds.forEach((emailId) => {
        if (emailId.toLowerCase().includes(searchQuery)) {
          const suggestion = document.createElement("div");
          suggestion.textContent = emailId;
          suggestion.classList.add("emailOptions");
          suggestionsContainer.appendChild(suggestion);
          suggestion.addEventListener("click", function () {
            searchInput.value = emailId; // Fill input with selected suggestion
            suggestionsContainer.innerHTML = ""; // Clear suggestions
          });
          suggestionsContainer.appendChild(suggestion);          
        }
    });
      });
      clearButton.addEventListener("click", function () {
        searchInput.value = ""; // Clear the input field
        suggestionsContainer.innerHTML = ""; // Clear the suggestions
    });

  invite.addEventListener("click",function(){
    const invited = document.createElement("div");
    invited.textContent = searchInput;
    invited.classList.add("emailOptions");

  })