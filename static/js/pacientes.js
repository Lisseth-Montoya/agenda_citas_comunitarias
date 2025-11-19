// --- VARIABLES PRINCIPALES ---
let pacientes = [];
let pacienteSeleccionadoIndex = null;

const form = document.getElementById('pacienteForm');
const tablaBody = document.getElementById('tablaPacientesBody');
const alertContainer = document.getElementById('alertContainer');

// --- FUNCIONES PRINCIPALES ---

// 1. Manejar envío del formulario (Guardar/Actualizar)
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nuevoPaciente = {
    nombre: document.getElementById('nombre').value.trim(),
    dui: document.getElementById('dui').value.trim(),
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    telefono: document.getElementById('telefono').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    direccion: document.getElementById('direccion').value.trim(),
    genero: document.getElementById('genero').value,
    estado: document.getElementById('estado').value,
    observaciones: document.getElementById('observaciones').value.trim()
  };

  if (pacienteSeleccionadoIndex !== null) {
    pacientes[pacienteSeleccionadoIndex] = nuevoPaciente;
    pacienteSeleccionadoIndex = null;
    showAlert('Paciente actualizado correctamente', 'success');
  } else {
    pacientes.push(nuevoPaciente);
    showAlert('Paciente registrado correctamente', 'success');
  }

  form.reset();
  renderTabla();
});

// 2. Renderizar la tabla
function renderTabla() {
  tablaBody.innerHTML = '';

  pacientes.forEach((paciente, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${paciente.nombre}</td>
      <td>${paciente.dui}</td>
      <td>${paciente.fechaNacimiento}</td>
      <td>${paciente.telefono}</td>
      <td>${paciente.correo}</td>
      <td>${paciente.genero}</td>
      <td>${paciente.direccion}</td>
      <td>${paciente.estado}</td>
      <td>
        <button class="btn btn-warning btn-editar btn-sm">
          <i class="bi bi-pencil-square"></i> Editar
        </button>
        <button class="btn btn-danger btn-eliminar btn-sm">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </td>
    `;

    // Botón Editar
    tr.querySelector('.btn-editar').addEventListener('click', (e) => {
      e.stopPropagation();
      pacienteSeleccionadoIndex = index;
      cargarPacienteEnFormulario(paciente);
    });

    // Botón Eliminar
    tr.querySelector('.btn-eliminar').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('¿Desea eliminar este paciente?')) {
        pacientes.splice(index, 1);
        pacienteSeleccionadoIndex = null;
        renderTabla();
        showAlert('Paciente eliminado correctamente', 'danger');
      }
    });

    tablaBody.appendChild(tr);
  });
}

// 3. Cargar datos en formulario para edición
function cargarPacienteEnFormulario(paciente) {
  document.getElementById('nombre').value = paciente.nombre;
  document.getElementById('dui').value = paciente.dui;
  document.getElementById('fechaNacimiento').value = paciente.fechaNacimiento;
  document.getElementById('telefono').value = paciente.telefono;
  document.getElementById('correo').value = paciente.correo;
  document.getElementById('direccion').value = paciente.direccion;
  document.getElementById('genero').value = paciente.genero;
  document.getElementById('estado').value = paciente.estado;
  document.getElementById('observaciones').value = paciente.observaciones;
}

// 4. Mostrar alertas de Bootstrap
function showAlert(mensaje, tipo) {
  alertContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  if (!form || !tablaBody || !alertContainer) {
    console.error('Error: Faltan elementos HTML necesarios.');
    return;
  }

  renderTabla();
});
