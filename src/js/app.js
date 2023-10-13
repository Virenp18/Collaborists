$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    var dropdownList = dropdownElementList.map(function (dropdownToggle) {
        return new bootstrap.Dropdown(dropdownToggle);
    });
    