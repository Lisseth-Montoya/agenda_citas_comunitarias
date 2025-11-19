// --- VARIABLES ---
let todosLosPacientes = [];
const form = document.getElementById("pacienteForm");
const tbody = document.getElementById("tablaPacientesBody");
const alertContainer = document.getElementById("alertContainer");

// ----------------------------------------------
// 1) CARGAR PACIENTES DESDE LA BD
// ----------------------------------------------
function cargarPacientes() {
    fetch("/api/pacientes")
        .then(r => r.json())
        .then(data => {
            todosLosPacientes = data;
            renderizarTabla(todosLosPacientes);
        })
        .catch(err => console.error("Error cargando:", err));
}

// ----------------------------------------------
// 2) MOSTRAR TABLA
// ----------------------------------------------
function renderizarTabla(lista) {
    tbody.innerHTML = "";

    lista.forEach(p => {
        const fila = `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.apellido}</td>
                <td>${p.dui}</td>
                <td>${p.fecha_nac}</td>
                <td>${p.telefono}</td>
                <td>${p.correo}</td>
                <td>${p.genero === "M" ? "Masculino" : "Femenino"}</td>
                <td>${p.observaciones}</td>
                <td>${p.direccion}</td>
                <td>${p.estado}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPaciente(${p.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${p.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// ----------------------------------------------
// 3) CARGAR PACIENTE EN FORMULARIO
// ----------------------------------------------
function editarPaciente(id) {
    const p = todosLosPacientes.find(x => x.id == id);
    if (!p) return;

    document.getElementById("id_paciente").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("apellido").value = p.apellido;
    document.getElementById("dui").value = p.dui;
    document.getElementById("fechaNacimiento").value = p.fecha_nac;
    document.getElementById("telefono").value = p.telefono;
    document.getElementById("correo").value = p.correo;
    document.getElementById("genero").value = p.genero;
    document.getElementById("estado").value = p.estado;
    document.getElementById("direccion").value = p.direccion;
    document.getElementById("observaciones").value = p.observaciones;

    document.getElementById("btnGuardar").innerHTML =
        `<i class="bi bi-arrow-repeat"></i> Actualizar`;
}

// ----------------------------------------------
// 4) GUARDAR / ACTUALIZAR
// ----------------------------------------------
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("id_paciente").value;

    // 🔥 IMPORTANTE: los nombres deben ser IGUALES al backend
    const paciente = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        dui: document.getElementById("dui").value,
        fecha_nac: document.getElementById("fechaNacimiento").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        genero: document.getElementById("genero").value,
        estado: document.getElementById("estado").value,
        direccion: document.getElementById("direccion").value,
        observaciones: document.getElementById("observaciones").value
    };

    const url = id ? `/api/pacientes/${id}` : `/api/pacientes`;
    const method = id ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente)
    })
        .then(r => r.json())
        .then(data => {
            mostrarAlerta("success", data.message || "Guardado exitoso");
            form.reset();
            document.getElementById("id_paciente").value = "";
            document.getElementById("btnGuardar").innerHTML =
                `<i class="bi bi-save"></i> Guardar`;
            cargarPacientes();
        })
        .catch(err => mostrarAlerta("danger", "Error al guardar"));
});

// ----------------------------------------------
// 5) ELIMINAR
// ----------------------------------------------
function eliminarPaciente(id) {
    if (!confirm("¿Eliminar paciente?")) return;

    fetch(`/api/pacientes/${id}`, { method: "DELETE" })
        .then(r => r.json())
        .then(data => {
            mostrarAlerta("success", data.message || "Eliminado correctamente");
            cargarPacientes();
        })
        .catch(() => mostrarAlerta("danger", "Error al eliminar"));
}

// ----------------------------------------------
// 6) FILTRAR PACIENTES
// ----------------------------------------------
function filtrarPacientes() {
    const filtroNombre = document.getElementById("inputFiltroNombreApellido").value.toLowerCase();
    const filtroDui = document.getElementById("inputFiltroDui").value.toLowerCase();

    const filtrados = todosLosPacientes.filter(p => {
        const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase();
        return (
            nombreCompleto.includes(filtroNombre) &&
            p.dui.toLowerCase().includes(filtroDui)
        );
    });

    renderizarTabla(filtrados);
}

// Eventos de filtros
document.getElementById("inputFiltroNombreApellido").addEventListener("input", filtrarPacientes);
document.getElementById("inputFiltroDui").addEventListener("input", filtrarPacientes);

// ----------------------------------------------
// 7) ALERTAS
// ----------------------------------------------
function mostrarAlerta(tipo, mensaje) {
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

// ----------------------------------------------
// 8) INICIO
// ----------------------------------------------
document.addEventListener("DOMContentLoaded", cargarPacientes);
