$(document).ready(function () {
    $(".content-wrapper").css({ opacity: 0, marginTop: "20px" });

    $(".content-wrapper").animate(
        { opacity: 1, marginTop: "0px" },
        350
    );
});
