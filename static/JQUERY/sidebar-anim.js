$(document).ready(function () {

    // Animación al abrir sidebar
    $('#sidebarMenu').on('show.bs.offcanvas', function () {
        $(this).find('.offcanvas-body').hide().slideDown(250);
    });

    // Animación al cerrar sidebar
    $('#sidebarMenu').on('hide.bs.offcanvas', function () {
        $(this).find('.offcanvas-body').slideUp(200);
    });

});
