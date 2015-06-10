function parseNumber(text) {
  return parseInt(text.substr(0, text.indexOf(' ')));
}

$(document).ready(function () {
  $(".dropdown-menu li a").click(function () {
    $(".btn:first-child").text($(this).text());
    $("#quantity").val(parseNumber($(this).text()));
  });
});
/*
function checkEmail() {
    var email = document.getElementById("email").value;
    var confemail = document.getElementById("confemail").value;
    if(email != confemail) {
      document.getElementById("confemail-parent").className = document.getElementById('confemail-parent').className.replace(/\bno-error\b/, 'has-error');
      document.getElementById('buy-btn').disabled = true;
    } else {
      document.getElementById("confemail-parent").className = document.getElementById('confemail-parent').className.replace(/\bhas-error\b/,'no-error');
      document.getElementById('buy-btn').disabled = false;
    }
}*/

//  Bind the event handler to the "submit" JavaScript event
$('form').submit(function () {

    // Get the Login Name value and trim it
    var email = $.trim($('#email').val());
    var confemail = $.trim($('#confemail').val());

    // Check if empty of not
    if (email  === '') {
        alert('Please enter email');
        return false;
    }
    //Check if email address matches
    if (email  != confemail) {
        alert('Please enter the email address correctly');
        return false;
    }

});