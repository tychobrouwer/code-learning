// On click then it runs the function
// $(document).ready(function() {
//     $(".row1 .button:first").addClass("active");
//     $(".row2 div:first").addClass("active");
//     $(".row2 .button2:first").addClass("active");
//     var valueLoadRaw = $(".row2 .button2.active").text().toLowerCase();
//     var valueLoad = valueLoadRaw.replace(/\s/g, '');
//     // var valueLoad = $.trim(valueLoadRaw);
//     $("."+valueLoad).addClass("active");
// });

$(".button").click(function() {
    // Get text inside span
    var valueRaw = $(this).text().toLowerCase();
    var value = valueRaw.replace(/\s/g, '');
    // var value = $.trim(valueRaw);
    // Remove all active on spans
    $(".content").find(".active").removeClass("active");
    // add class active on clicked button
    $(this).addClass("active");
    // Removes active on row2
    $(".row2").find(".active").removeClass("active");
    // Add class active to row2
    $(".row2").find("."+value).addClass("active");
    // Add active to first span in row-(value)-items
    $("div.row-"+value+"-items .button2:first").addClass("active");
    // Add content for first span
    var valueLoadRaw = $(".row2 .button2.active").text().toLowerCase();
    var valueLoad = valueLoadRaw.replace(/\s/g, '');
    // var valueLoad = $.trim(valueLoadRaw);
    $("."+valueLoad).addClass("active");
});

$(".button2").click(function() {
    $("div .row-data").removeClass("active");
    $(".row-items").find(".active").removeClass("active");
    $(this).addClass("active");
    var valueRaw = $(this).text().toLowerCase(); 
    var value = valueRaw.replace(/\s/g, '');
    // var value = $.trim(valueRaw);
    $("."+value).addClass("active");
});

/*
.active is the thing that decides if the element is hidden or not.

.content is the main div.
.row1 is the main row.
.row2 is the sub row under main row.
.button is the main row span elements.
.button2 is the sub row span elements.
.row-items is the div for the collected span "buttons".
.row-data+"(name of page)" is the page that will be activated.
*/
