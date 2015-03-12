function parseNumber(text) {
  return parseInt(text.substr(0, text.indexOf(' ')));
}

$(document).ready(function () {
  $(".dropdown-menu li a").click(function () {
    $(".btn:first-child").text($(this).text());
    $("#quantity").val(parseNumber($(this).text()));
  });
});
