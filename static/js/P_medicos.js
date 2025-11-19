let contador = 1;
let filaSeleccionada = null;
const tabla = document.getElementById("tablaDoctores").getElementsByTagName("tbody")[0];

// Crear registro
document.getElementById("doctorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const datos = obtenerDatosFormulario();

  if (!filaSeleccionada) {
    agregarFila(datos);
  } else {
    alert("Estás en modo edición. Usa el botón GUARDAR para aplicar los cambios.");
  }

  this.reset();
});

// Guardar (actualiza la fila seleccionada)
document.getElementById("btnGuardar").addEventListener("click", function () {
  if (filaSeleccionada) {
    const datos = obtenerDatosFormulario();
    actualizarFila(filaSeleccionada, datos);
    filaSeleccionada = null;
    document.getElementById("doctorForm").reset();
    alert("Cambios guardados correctamente.");
  } else {
    alert("No hay registro seleccionado para guardar.");
  }
});

// Editar (carga datos al formulario)
document.getElementById("btnEditar").addEventListener("click", function () {
  const fila = obtenerFilaSeleccionada();
  if (!fila) return alert("Selecciona una fila haciendo clic en ella.");

  filaSeleccionada = fila;
  cargarDatosEnFormulario(fila);
});

// Eliminar
document.getElementById("btnEliminar").addEventListener("click", function () {
  const fila = obtenerFilaSeleccionada();
  if (!fila) return alert("Selecciona una fila para eliminar.");

  if (confirm("¿Seguro que deseas eliminar este registro?")) {
    fila.remove();
    if (tabla.rows.length === 0) agregarFilaVacia();
    filaSeleccionada = null;
  }
});

<<<<<<< HEAD
//  Buscar
=======
//  Buscar (por nombre o apellido)
>>>>>>> origin/feature/Fredi
document.getElementById("btnBuscar").addEventListener("click", function () {
  const termino = prompt("Ingrese nombre o apellido a buscar:");
  if (!termino) return;

  for (let fila of tabla.rows) {
<<<<<<< HEAD
    if (fila.cells[0].colSpan === 9) continue;
=======
    if (fila.cells[0].colSpan === 8) continue; // saltar fila vacía
>>>>>>> origin/feature/Fredi

    const nombre = fila.cells[1].textContent.toLowerCase();
    const apellido = fila.cells[2].textContent.toLowerCase();
    const visible = nombre.includes(termino.toLowerCase()) || apellido.includes(termino.toLowerCase());
    fila.style.display = visible ? "" : "none";
  }
});

<<<<<<< HEAD
document.getElementById("btnVolver").addEventListener("click", function () {
  restaurarFilas();
  alert("Se restauraron todos los registros.");
});

=======
>>>>>>> origin/feature/Fredi
//  Borrar todos
document.getElementById("btnBorrar").addEventListener("click", function () {
  if (confirm("¿Deseas borrar todos los registros?")) {
    tabla.innerHTML = "";
    agregarFilaVacia();
    contador = 1;
    filaSeleccionada = null;
  }
});

//  Funciones auxiliares
function obtenerDatosFormulario() {
  return {
    nombres: document.getElementById("nombres").value,
    apellidos: document.getElementById("apellidos").value,
    dui: document.getElementById("dui").value,
    especialidad: document.getElementById("especialidad").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
<<<<<<< HEAD
    horario: document.getElementById("horario").value,
=======
>>>>>>> origin/feature/Fredi
    estado: document.getElementById("estado").value
  };
}

function agregarFila(datos) {
<<<<<<< HEAD
  if (tabla.rows.length === 1 && tabla.rows[0].cells[0].colSpan === 9) tabla.innerHTML = "";
=======
  if (tabla.rows.length === 1 && tabla.rows[0].cells[0].colSpan === 8) tabla.innerHTML = "";
>>>>>>> origin/feature/Fredi

  const fila = tabla.insertRow();
  fila.insertCell(0).textContent = contador++;
  fila.insertCell(1).textContent = datos.nombres;
  fila.insertCell(2).textContent = datos.apellidos;
  fila.insertCell(3).textContent = datos.dui;
  fila.insertCell(4).textContent = datos.especialidad;
  fila.insertCell(5).textContent = datos.telefono;
  fila.insertCell(6).textContent = datos.email;
<<<<<<< HEAD
  fila.insertCell(7).textContent = datos.horario;

  const estadoCell = fila.insertCell(8);
=======

  const estadoCell = fila.insertCell(7);
>>>>>>> origin/feature/Fredi
  const select = document.createElement("select");
  select.className = "form-select form-select-sm";
  select.innerHTML = `
    <option value="Activo" ${datos.estado === "Activo" ? "selected" : ""}>Activo</option>
    <option value="Inactivo" ${datos.estado === "Inactivo" ? "selected" : ""}>Inactivo</option>
  `;
  estadoCell.appendChild(select);
  actualizarColorEstado(select);
  select.addEventListener("change", () => actualizarColorEstado(select));

  fila.addEventListener("click", () => seleccionarFila(fila));
}

function actualizarFila(fila, datos) {
  fila.cells[1].textContent = datos.nombres;
  fila.cells[2].textContent = datos.apellidos;
  fila.cells[3].textContent = datos.dui;
  fila.cells[4].textContent = datos.especialidad;
  fila.cells[5].textContent = datos.telefono;
  fila.cells[6].textContent = datos.email;
<<<<<<< HEAD
  fila.cells[7].textContent = datos.horario;
=======
>>>>>>> origin/feature/Fredi
  fila.querySelector("select").value = datos.estado;
  actualizarColorEstado(fila.querySelector("select"));
}

function cargarDatosEnFormulario(fila) {
  document.getElementById("nombres").value = fila.cells[1].textContent;
  document.getElementById("apellidos").value = fila.cells[2].textContent;
  document.getElementById("dui").value = fila.cells[3].textContent;
  document.getElementById("especialidad").value = fila.cells[4].textContent;
  document.getElementById("telefono").value = fila.cells[5].textContent;
  document.getElementById("email").value = fila.cells[6].textContent;
<<<<<<< HEAD
  document.getElementById("horario").value = fila.cells[7].textContent;
=======
>>>>>>> origin/feature/Fredi
  document.getElementById("estado").value = fila.querySelector("select").value;
}

function seleccionarFila(fila) {
  for (let f of tabla.rows) f.classList.remove("table-active");
  fila.classList.add("table-active");
  filaSeleccionada = fila;
}

function obtenerFilaSeleccionada() {
  return filaSeleccionada;
}

function actualizarColorEstado(select) {
  if (select.value === "Activo") {
    select.classList.add("text-success");
    select.classList.remove("text-danger");
  } else {
    select.classList.add("text-danger");
    select.classList.remove("text-success");
  }
}

function agregarFilaVacia() {
<<<<<<< HEAD
  tabla.innerHTML = '<tr><td colspan="9" class="text-muted">Sin registros</td></tr>';
}

function restaurarFilas() {
  for (let fila of tabla.rows) {
    fila.style.display = "";
  }
=======
  tabla.innerHTML = '<tr><td colspan="8" class="text-muted">Sin registros</td></tr>';
>>>>>>> origin/feature/Fredi
}
