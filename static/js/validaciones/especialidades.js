document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formEspecialidad");
    const btnLimpiar = document.getElementById("btnLimpiar");

    const inputId = document.getElementById("id_especialidad");
    const inputNombre = document.getElementById("nombre");
    const inputDescripcion = document.getElementById("descripcion");
    const inputDuracion = document.getElementById("duracion");
    const inputPrecio = document.getElementById("precio");
    const inputEstado = document.getElementById("estado");
    const inputFecha = document.getElementById("fechaRegistro");

    cargarEspecialidades();

    // ============================================================
    // LISTAR ESPECIALIDADES
    // ============================================================
    function cargarEspecialidades() {
        fetch("/api/especialidades/listar")
            .then(r => r.json())
            .then(data => llenarTabla(data))
            .catch(err => console.error(err));
    }

    function llenarTabla(lista) {
        const tbody = document.getElementById("tbodyEspecialidades");
        tbody.innerHTML = "";

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-muted">Sin registros</td></tr>`;
            return;
        }

        lista.forEach(e => {
            tbody.innerHTML += `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.nombre}</td>
                    <td>${e.descripcion}</td>
                    <td>${e.duracion_min} min</td>
                    <td>$${e.precio_base}</td>
                    <td>${e.estado}</td>
                    <td>${e.fecha_registro}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarEspecialidad(${e.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarEspecialidad(${e.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    // ============================================================
    // GUARDAR / EDITAR
    // ============================================================
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const data = {
            id: inputId.value || null,
            nombre: inputNombre.value,
            descripcion: inputDescripcion.value,
            duracion_min: inputDuracion.value,
            precio_base: inputPrecio.value,
            estado: inputEstado.value
        };

        fetch("/api/especialidades/guardar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(r => r.json())
            .then(resp => {
                mostrarAlerta();
                limpiarFormulario();
                cargarEspecialidades();
            })
            .catch(err => console.error(err));
    });

    // ============================================================
    // EDITAR
    // ============================================================
    window.editarEspecialidad = function (id) {

        fetch(`/api/especialidades/obtener/${id}`)
            .then(r => r.json())
            .then(e => {

                inputId.value = e.id;
                inputNombre.value = e.nombre;
                inputDescripcion.value = e.descripcion;
                inputDuracion.value = e.duracion_min;
                inputPrecio.value = e.precio_base;
                inputEstado.value = e.estado;
                inputFecha.value = e.fecha_registro;
            });
    };

    // ============================================================
    // ELIMINAR
    // ============================================================
    window.eliminarEspecialidad = function (id) {

        if (!confirm("¿Eliminar esta especialidad?")) return;

        fetch(`/api/especialidades/eliminar/${id}`, { method: "DELETE" })
            .then(r => r.json())
            .then(() => cargarEspecialidades());
    };

    // ============================================================
    // LIMPIAR
    // ============================================================
    btnLimpiar.addEventListener("click", limpiarFormulario);

    function limpiarFormulario() {
        inputId.value = "";
        inputNombre.value = "";
        inputDescripcion.value = "";
        inputDuracion.value = "";
        inputPrecio.value = "";
        inputEstado.value = "Activo";
        inputFecha.value = "";
    }

    // ============================================================
    // ALERTA
    // ============================================================
    function mostrarAlerta() {
        const alerta = document.getElementById("alerta");
        alerta.classList.remove("d-none");

        setTimeout(() => alerta.classList.add("d-none"), 3000);
    }
});
