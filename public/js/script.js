function parseNumber(text) {
  return parseInt(text.substr(0, text.indexOf(' ')));
}

$(document).ready(function () {
  $(".dropdown-menu li a").click(function () {
    $(".btn:first-child").text($(this).text());
    $("#quantity").val(parseNumber($(this).text()));
  });
});

// function checkEmail() {
//     var email = document.getElementById("email").value;
//     var confemail = document.getElementById("confemail").value;
//     if (!email) {
//       document.getElementById("email-parent").className = document.getElementById('confemail-parent').className.replace(/\bno-error\b/, 'has-error');
//       // alert('Please enter email');
//       return false;
//     }
//     else if (email != confemail) {
//       document.getElementById("email-parent").className = document.getElementById('confemail-parent').className.replace(/\bhas-error\b/,'no-error');
//       document.getElementById("confemail-parent").className = document.getElementById('confemail-parent').className.replace(/\bno-error\b/, 'has-error');
//       // alert('Confirm Email must match with the Email');
//       return false;
//     } else {
//       document.getElementById("confemail-parent").className = document.getElementById('confemail-parent').className.replace(/\bhas-error\b/,'no-error');
//       return true;
//     }
// }

function check(input) {
  if (input.value != document.getElementById('email').value) {
    input.setCustomValidity('Email Must be Matching.');
    input.parentNode.className = input.parentNode.className.replace(/\bno-error\b/, 'has-error');
  } else {
    // input is valid -- reset the error message
    input.parentNode.className = input.parentNode.className.replace(/\bhas-error\b/, 'no-error');
    input.setCustomValidity('');
  }
}

  //Bind the event handler to the "submit" JavaScript event
// $('form').submit(function () {

//     // // Get the Login Name value and trim it
//     // var email = $.trim($('#email').val());
//     // var confemail = $.trim($('#confemail').val());

//     // // Check if empty of not
//     // if (email  === '') {
//     //     alert('Please enter email');
//     //     return false;
//     // }
//     // //Check if email address matches
//     // if (email  != confemail) {
//     //     alert('Please enter the email address correctly');
//     //     return false;
//     // }
//     if(!checkEmail()) return false;

// });