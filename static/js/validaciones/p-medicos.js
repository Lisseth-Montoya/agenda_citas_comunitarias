// =============================================
//   SISTEMA DE PERFILES MÉDICOS
// =============================================
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("doctorForm");
    const tbody = document.getElementById("tbodyDoctores");
    let medicoEditando = null; // para modo edición

    cargarTabla();


    // ================================
    // CARGAR TABLA
    // ================================
    async function cargarTabla() {
        const resp = await fetch("/api/medicos/listar");
        const medicos = await resp.json();

        tbody.innerHTML = "";

        if (medicos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-muted">Sin registros</td></tr>`;
            return;
        }

        medicos.forEach(m => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${m.id}</td>
                <td>${m.nombres}</td>
                <td>${m.apellidos}</td>
                <td>${m.dui}</td>
                <td>${m.especialidad}</td>
                <td>${m.telefono}</td>
                <td>${m.email}</td>
                <td>${m.estado}</td>
            `;

            tr.addEventListener("click", () => seleccionarMedico(m));

            tbody.appendChild(tr);
        });
    }


    // ================================
    // SELECCIONAR MÉDICO (PARA EDITAR)
    // ================================
    function seleccionarMedico(m) {
        medicoEditando = m.id;

        document.getElementById("nombres").value = m.nombres;
        document.getElementById("apellidos").value = m.apellidos;
        document.getElementById("dui").value = m.dui;
        document.getElementById("especialidad").value = m.especialidad;
        document.getElementById("telefono").value = m.telefono;
        document.getElementById("email").value = m.email;
        document.getElementById("estado").value = m.estado;
    }


    // ================================
    // GUARDAR MÉDICO (CREAR / EDITAR)
    // ================================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            id: medicoEditando,
            nombres: document.getElementById("nombres").value,
            apellidos: document.getElementById("apellidos").value,
            dui: document.getElementById("dui").value,
            especialidad: document.getElementById("especialidad").value,
            telefono: document.getElementById("telefono").value,
            email: document.getElementById("email").value,
            estado: document.getElementById("estado").value
        };

        await fetch("/api/medicos/guardar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        mostrarAlerta();
        medicoEditando = null;
        form.reset();
        cargarTabla();
    });


    // ================================
    // ELIMINAR MÉDICO
    // ================================
    document.getElementById("btnEliminar").addEventListener("click", async () => {
        if (!medicoEditando) {
            alert("Seleccione un médico");
            return;
        }

        if (!confirm("¿Eliminar médico?")) return;

        await fetch(`/api/medicos/eliminar/${medicoEditando}`, {
            method: "DELETE"
        });

        medicoEditando = null;
        form.reset();
        cargarTabla();
    });


    // ================================
    // LIMPIAR FORM
    // ================================
    document.getElementById("btnBorrar").addEventListener("click", () => {
        medicoEditando = null;
        form.reset();
    });


    // ================================
    // ALERTA
    // ================================
    function mostrarAlerta() {
        const alerta = document.getElementById("alerta");
        alerta.classList.remove("d-none");
        setTimeout(() => alerta.classList.add("d-none"), 2500);
    }
});
