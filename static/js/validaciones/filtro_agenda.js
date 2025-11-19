document.addEventListener("DOMContentLoaded", () => {

    const filtroFecha = document.getElementById("filtroFecha");
    const filtroProfesional = document.getElementById("filtroProfesional");
    const filtroEstado = document.getElementById("filtroEstado");
    const filas = document.querySelectorAll("#tablaCitas tr");

    function filtrar() {
        const fecha = filtroFecha.value;
        const profesional = filtroProfesional.value;
        const estado = filtroEstado.value;

        filas.forEach(fila => {
            const fFecha = fila.dataset.fecha;
            const fProf = fila.dataset.profesional;
            const fEstado = fila.dataset.estado;

            let visible = true;

            if (fecha && fFecha !== fecha) visible = false;
            if (profesional && fProf !== profesional) visible = false;
            if (estado && fEstado !== estado) visible = false;

            fila.style.display = visible ? "" : "none";
        });
    }

    filtroFecha.addEventListener("change", filtrar);
    filtroProfesional.addEventListener("change", filtrar);
    filtroEstado.addEventListener("change", filtrar);
});
