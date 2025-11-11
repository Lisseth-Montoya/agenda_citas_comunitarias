document.addEventListener('DOMContentLoaded', () => {
  const tablaCitas = document.getElementById('tablaCitas');
  const filtroFecha = document.getElementById('filtroFecha');
  const filtroProfesional = document.getElementById('filtroProfesional');
  const filtroEstado = document.getElementById('filtroEstado');

  function cargarCitas() {
    tablaCitas.innerHTML = '';
    let citas = JSON.parse(localStorage.getItem('citas')) || [];

    // Filtros
    const fecha = filtroFecha.value;
    const profesional = filtroProfesional.value;
    const estado = filtroEstado.value;

    if (fecha) citas = citas.filter(c => c.fecha === fecha);
    if (profesional) citas = citas.filter(c => c.profesional === profesional);
    if (estado) citas = citas.filter(c => c.estado === estado);

    if (citas.length === 0) {
      const fila = document.createElement('tr');
      fila.innerHTML = `<td colspan="7" class="text-center text-muted">No hay citas registradas</td>`;
      tablaCitas.appendChild(fila);
      return;
    }

    citas.forEach(cita => agregarFila(cita));
  }

  function agregarFila(cita) {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${cita.id}</td>
      <td>${cita.paciente}</td>
      <td>${cita.profesional}</td>
      <td>${cita.fecha}</td>
      <td>${cita.hora}</td>
      <td>
        <span class="badge ${
          cita.estado === 'Completada' ? 'bg-secondary' :
          cita.estado === 'Cancelada' ? 'bg-danger' :
          'bg-success'
        }">${cita.estado}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
        <button class="btn btn-sm btn-outline-warning me-1" title="Reprogramar"><i class="bi bi-calendar-event"></i></button>
        <button class="btn btn-sm btn-outline-danger" title="Cancelar"><i class="bi bi-x-circle"></i></button>
      </td>
    `;

    // === Acciones ===
    const btnVer = fila.querySelector('.btn-outline-primary');
    const btnEditar = fila.querySelector('.btn-outline-warning');
    const btnEliminar = fila.querySelector('.btn-outline-danger');

    btnVer.addEventListener('click', () => {
      alert(`
📋 Detalles de la Cita:
Paciente: ${cita.paciente}
Profesional: ${cita.profesional}
Especialidad: ${cita.especialidad}
Fecha: ${cita.fecha}
Hora: ${cita.hora}
Estado: ${cita.estado}
Notas: ${cita.notas || 'Sin notas'}
      `);
    });

    btnEditar.addEventListener('click', () => {
      localStorage.setItem('citaEditar', JSON.stringify(cita));
      window.location.href = '../Para registrar/Registrar_Citas.html';
    });

    btnEliminar.addEventListener('click', () => {
      if (confirm(`¿Seguro que desea eliminar la cita de ${cita.paciente}?`)) {
        eliminarCita(cita.id);
      }
    });

    tablaCitas.appendChild(fila);
  }

  function eliminarCita(id) {
    let citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas = citas.filter(c => c.id !== id);
    localStorage.setItem('citas', JSON.stringify(citas));
    cargarCitas();
  }

  // Filtros en tiempo real
  [filtroFecha, filtroProfesional, filtroEstado].forEach(input => {
    input.addEventListener('change', cargarCitas);
  });

  // Cargar al iniciar
  cargarCitas();
});
