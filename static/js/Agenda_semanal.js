// Agenda_semanal.js
const diasSemana = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = (day === 0) ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0,0,0,0);
  return d;
}

function addDays(date, n) {
  const r = new Date(date);
  r.setDate(r.getDate() + n);
  return r;
}

function formatHeaderLabel(d) {
  return `${diasSemana[d.getDay()]} ${d.getDate()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const headerRow = document.getElementById('headerDias');
  const cuerpo = document.getElementById('cuerpoAgenda');
  const fechaInput = document.getElementById('fechaSemana');
  const btnHoy = document.getElementById('btnHoy');
  const filtroMedico = document.getElementById('filtroMedico');

  // set hoy por defecto
  const hoy = new Date();
  if (fechaInput) {
    fechaInput.valueAsDate = hoy;
    // bloquear domingos
    fechaInput.addEventListener('input', () => {
      const d = new Date(fechaInput.value);
      if (d.getDay() === 0) {
        alert('No se pueden seleccionar domingos.');
        fechaInput.valueAsDate = hoy;
      }
    });
  }

  function renderWeek(baseDate) {
    const monday = startOfWeek(baseDate);

    // Header
    headerRow.innerHTML = '';
    const thHora = document.createElement('th');
    thHora.textContent = 'Hora';
    headerRow.appendChild(thHora);

    for (let i = 0; i < 6; i++) {
      const d = addDays(monday, i);
      const th = document.createElement('th');
      th.textContent = formatHeaderLabel(d);
      th.dataset.date = d.toISOString().slice(0,10);
      headerRow.appendChild(th);
    }

    // Filas de horario (7:00 a 19:30)
    cuerpo.innerHTML = '';
    let hour = 7, minutes = 0;
    while (hour < 20) {
      const tr = document.createElement('tr');
      const tdHora = document.createElement('td');
      tdHora.className = 'hour-cell';
      tdHora.textContent = `${String(hour).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;
      tr.appendChild(tdHora);

      for (let d = 0; d < 6; d++) {
        const td = document.createElement('td');
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.dayIndex = d;
        slot.dataset.time = `${String(hour).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;

        // crear tres bloques (uno por médico)
        for (let i = 1; i <= 3; i++) {
          const bloque = document.createElement('div');
          bloque.className = `bloque-cita medico-${i}`;
          bloque.textContent = ''; // vacío hasta que se llene con cita
          slot.appendChild(bloque);
        }

        td.appendChild(slot);
        tr.appendChild(td);
      }

      cuerpo.appendChild(tr);
      minutes += 30;
      if (minutes === 60) { minutes = 0; hour++; }
    }

    placeCitasInWeek(monday);
  }

  function placeCitasInWeek(monday) {
    const citas = JSON.parse(localStorage.getItem('citas') || '[]');
    document.querySelectorAll('.bloque-cita').forEach(b => {
      b.textContent = '';
      b.removeEventListener('click', b.onclick);
    });

    citas.forEach(cita => {
      const fechaCita = new Date(cita.fecha + 'T00:00:00');
      const diffDays = Math.round((fechaCita - monday) / (1000*60*60*24));
      if (diffDays >= 0 && diffDays < 6) {
        const selector = `.slot[data-day-index="${diffDays}"][data-time="${cita.hora}"]`;
        const slot = document.querySelector(selector);
        if (slot) {
          // Asignar bloque según profesional
          let bloque;
          if (cita.profesional.includes('Juan')) bloque = slot.querySelector('.medico-1');
          else if (cita.profesional.includes('María')) bloque = slot.querySelector('.medico-2');
          else bloque = slot.querySelector('.medico-3');

          if (bloque) {
            bloque.textContent = cita.paciente;
            bloque.addEventListener('click', (e) => {
              e.stopPropagation();
              alert(
                `Cita:\nPaciente: ${cita.paciente}\nProfesional: ${cita.profesional}\nFecha: ${cita.fecha}\nHora: ${cita.hora}\nEstado: ${cita.estado}`
              );
            });
          }
        }
      }
    });
  }

  // Render inicial
  renderWeek(hoy);

  // Cambiar semana
  if (fechaInput) {
    fechaInput.addEventListener('change', (e) => {
      const d = new Date(e.target.value + 'T00:00:00');
      renderWeek(d);
    });
  }

  if (btnHoy) {
    btnHoy.addEventListener('click', () => {
      fechaInput.valueAsDate = new Date();
      renderWeek(new Date());
    });
  }

  // Actualizar cuando se guarde una cita
  window.addEventListener('citas:updated', () => {
    const d = (fechaInput && fechaInput.value)
      ? new Date(fechaInput.value + 'T00:00:00')
      : new Date();
    renderWeek(d);
  });
});
