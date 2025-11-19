$(document).ready(function () {
    $(".nav-link").on("click", function (e) {

        let ripple = $("<span class='ripple'></span>");
        let pos = $(this).offset();
        let width = $(this).width();
        let x = e.pageX - pos.left - width / 2;
        let y = e.pageY - pos.top;

        ripple.css({
            top: y + "px",
            left: x + "px"
        });

        $(this).append(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
