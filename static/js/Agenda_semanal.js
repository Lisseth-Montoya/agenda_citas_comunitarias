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

  const hoy = new Date();
  fechaInput.valueAsDate = hoy;

  function renderWeek(baseDate) {
    const monday = startOfWeek(baseDate);

    // Generar cabecera
    headerRow.innerHTML = '';
    const thHora = document.createElement('th');
    thHora.textContent = 'Hora';
    headerRow.appendChild(thHora);

    for (let i = 0; i < 6; i++) {
      const d = addDays(monday, i);
      const th = document.createElement('th');
      th.textContent = formatHeaderLabel(d);
      headerRow.appendChild(th);
    }

    // Generar filas
    cuerpo.innerHTML = '';
    let hour = 7;
    let minutes = 0;
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
        td.appendChild(slot);
        tr.appendChild(td);
      }

      cuerpo.appendChild(tr);
      minutes += 30;
      if (minutes === 60) { minutes = 0; hour++; }
    }

    // 🔹 Mostrar citas guardadas
    mostrarCitasEnSemana(monday);
  }

  // 🔹 Cargar citas desde localStorage y mostrarlas en las celdas correctas
  function mostrarCitasEnSemana(monday) {
    const citas = JSON.parse(localStorage.getItem("citas")) || [];

    citas.forEach(cita => {
      const fechaCita = new Date(cita.fecha + "T00:00:00");
      const diff = Math.floor((fechaCita - monday) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 6) {
        // Buscar la celda de ese día y hora
        const slot = document.querySelector(`.slot[data-day-index="${diff}"][data-time="${cita.hora}"]`);
        if (slot) {
          // Crear una tarjeta dentro de la celda
          const card = document.createElement('div');
          card.className = 'card bg-info text-white p-1 small mb-1';
          card.style.cursor = 'pointer';
          card.innerHTML = `
            <strong>${cita.paciente}</strong><br>
            <span>${cita.profesional}</span>
          `;
          // Cuando se hace clic, muestra alerta tipo "Ver"
          card.addEventListener('click', () => {
            alert(
              `Cita Médica\n\n` +
              `Paciente: ${cita.paciente}\n` +
              `Profesional: ${cita.profesional}\n` +
              `Fecha: ${cita.fecha}\n` +
              `Hora: ${cita.hora}\n` +
              `Estado: ${cita.estado}`
            );
          });
          slot.appendChild(card);
        }
      }
    });
  }

  renderWeek(hoy);

  fechaInput.addEventListener('change', (e) => {
    const d = new Date(e.target.value + 'T00:00:00');
    renderWeek(d);
  });

  btnHoy.addEventListener('click', () => {
    fechaInput.valueAsDate = new Date();
    renderWeek(new Date());
  });
});
