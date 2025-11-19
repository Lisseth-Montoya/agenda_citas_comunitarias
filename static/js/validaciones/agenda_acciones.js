document.addEventListener("DOMContentLoaded", () => {

    // ============================ MODAL VER ============================
    const modalVer = new bootstrap.Modal(document.getElementById("modalVer"));

    document.querySelectorAll(".btn-ver").forEach(btn => {
        btn.addEventListener("click", (e) => {

            const tr = e.target.closest("tr");

            document.getElementById("verPaciente").innerText = tr.dataset.paciente;
            document.getElementById("verMedico").innerText = tr.dataset.medico;
            document.getElementById("verFecha").innerText = tr.dataset.fecha;
            document.getElementById("verHora").innerText = tr.dataset.hora;
            document.getElementById("verEstado").innerText = tr.dataset.estado;
            document.getElementById("verDetalles").innerText = tr.dataset.detalles;

            modalVer.show();
        });
    });


    // ============================ ELIMINAR ============================
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", async (e) => {

            const tr = e.target.closest("tr");
            const id = tr.dataset.id;

            if (!confirm(`¿Seguro que deseas eliminar la cita #${id}?`)) return;

            const res = await fetch(`/citas/eliminar/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                tr.remove();
                alert("Cita eliminada correctamente.");
            } else {
                alert("Error al eliminar la cita.");
            }
        });
    });

});
