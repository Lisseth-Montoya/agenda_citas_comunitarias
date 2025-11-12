(() => {
  'use strict';

  const form = document.getElementById('formCita');

  // Verificamos si hay datos para editar
  const citaEditar = JSON.parse(localStorage.getItem('citaEditar'));
  if (citaEditar) {
    document.getElementById('paciente').value = citaEditar.paciente;
    document.getElementById('dui').value = citaEditar.dui;
    document.getElementById('especialidad').value = citaEditar.especialidad;
    document.getElementById('profesional').value = citaEditar.profesional;
    document.getElementById('fecha').value = citaEditar.fecha;
    document.getElementById('hora').value = citaEditar.hora;
    document.getElementById('duracion').value = citaEditar.duracion;
    document.getElementById('estado').value = citaEditar.estado;
    document.getElementById('notas').value = citaEditar.notas;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Objeto de cita
    const nuevaCita = {
      id: citaEditar ? citaEditar.id : Date.now(),
      paciente: document.getElementById('paciente').value,
      dui: document.getElementById('dui').value,
      especialidad: document.getElementById('especialidad').value,
      profesional: document.getElementById('profesional').value,
      fecha: document.getElementById('fecha').value,
      hora: document.getElementById('hora').value,
      duracion: document.getElementById('duracion').value,
      estado: document.getElementById('estado').value,
      notas: document.getElementById('notas').value
    };

    // Obtener citas existentes
    const citasGuardadas = JSON.parse(localStorage.getItem('citas')) || [];

    if (citaEditar) {
      // Editar cita existente
      const index = citasGuardadas.findIndex(c => c.id === citaEditar.id);
      if (index !== -1) citasGuardadas[index] = nuevaCita;
      localStorage.removeItem('citaEditar');
    } else {
      // Agregar nueva cita
      citasGuardadas.push(nuevaCita);
    }

    // Guardar en localStorage
    localStorage.setItem('citas', JSON.stringify(citasGuardadas));

    alert(' Cita guardada correctamente');
    form.reset();
    form.classList.remove('was-validated');
  });
})();
