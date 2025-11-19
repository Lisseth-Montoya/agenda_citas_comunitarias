// ===========================================================
// VALIDACIONES DEL FORMULARIO DE REGISTRO DE CITAS MÉDICAS
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formCita");

    // === Inputs ===
    const paciente = document.getElementById("paciente");
    const dui = document.getElementById("dui");
    const especialidad = document.getElementById("especialidad");
    const profesional = document.getElementById("profesional");
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const duracion = document.getElementById("duracion");
    const notas = document.getElementById("notas");

    const btnRegistrarPaciente = document.getElementById("btnRegistrarPaciente");

    // ===========================================================
    // BOTÓN: REGISTRAR PACIENTE (USA DUI)
    // ===========================================================
    btnRegistrarPaciente.addEventListener("click", (e) => {
        e.preventDefault();

        const valorDUI = dui.value.trim();

        if (valorDUI === "") {
            alert("Ingrese un DUI antes de registrar un paciente.");
            dui.focus();
            return;
        }

        const url = `/pacientes?dui=${encodeURIComponent(valorDUI)}`;
        window.location.href = url;
    });

    // ===========================================================
    // Funciones de validación individuales
    // ===========================================================
    function marcarInvalido(campo) {
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");
    }

    function marcarValido(campo) {
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");
    }

    function validarNombre() {
        const nombre = paciente.value.trim();
        if (nombre.length < 3) {
            marcarInvalido(paciente);
            return false;
        }
        marcarValido(paciente);
        return true;
    }

    function validarDUI() {
        const regexDUI = /^\d{8}-\d{1}$/;

        if (!regexDUI.test(dui.value.trim())) {
            marcarInvalido(dui);
            return false;
        }
        marcarValido(dui);
        return true;
    }

    function validarEspecialidad() {
        if (!especialidad.value) {
            marcarInvalido(especialidad);
            return false;
        }
        marcarValido(especialidad);
        return true;
    }

    function validarProfesional() {
        if (!profesional.value) {
            marcarInvalido(profesional);
            return false;
        }
        marcarValido(profesional);
        return true;
    }

    function validarFecha() {
        if (!fecha.value) {
            marcarInvalido(fecha);
            return false;
        }
        marcarValido(fecha);
        return true;
    }

    function validarHora() {
        if (!hora.value) {
            marcarInvalido(hora);
            return false;
        }
        marcarValido(hora);
        return true;
    }

    function validarDuracion() {
        if (duracion.value === "") return true;

        const d = parseInt(duracion.value);

        if (isNaN(d) || d < 10 || d > 180) {
            marcarInvalido(duracion);
            return false;
        }
        marcarValido(duracion);
        return true;
    }

    function validarNotas() {
        if (notas.value.length > 300) {
            marcarInvalido(notas);
            return false;
        }
        marcarValido(notas);
        return true;
    }

    // ===========================================================
    // VALIDACIÓN GLOBAL DEL FORMULARIO
    // ===========================================================
    form.addEventListener("submit", (e) => {

        const valido =
            validarNombre() &&
            validarDUI() &&
            validarEspecialidad() &&
            validarProfesional() &&
            validarFecha() &&
            validarHora() &&
            validarDuracion() &&
            validarNotas();

        if (!valido) {
            e.preventDefault();
            e.stopPropagation();
            form.classList.add("was-validated");
            alert("⚠️ Por favor complete correctamente todos los campos obligatorios.");
            return;
        }

        form.classList.add("was-validated");
    });

    // ===========================================================
    // VALIDACIONES EN TIEMPO REAL
    // ===========================================================
    paciente.addEventListener("input", validarNombre);
    dui.addEventListener("input", validarDUI);
    especialidad.addEventListener("change", validarEspecialidad);
    profesional.addEventListener("change", validarProfesional);
    fecha.addEventListener("change", validarFecha);
    hora.addEventListener("change", validarHora);
    duracion.addEventListener("input", validarDuracion);
    notas.addEventListener("input", validarNotas);

});
