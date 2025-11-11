
const especialidades = [
  { id: 'cardio', nombre: 'Cardiología' },
  { id: 'derma', nombre: 'Dermatología' },
  { id: 'pedi', nombre: 'Pediatría' },
];

const profesionales = [
  { id: 'p1', nombre: 'Dra. María Pérez', especialidad: 'cardio' },
  { id: 'p2', nombre: 'Dr. José López', especialidad: 'derma' },
  { id: 'p3', nombre: 'Dra. Ana Ruiz', especialidad: 'pedi' },
];

let citas = [
  { id: 1, especialidad: 'cardio', profesional: 'p1', paciente: 'Juan López', fecha: addDays(new Date(), 0), hora: '09:00', duracion: 30, estado: 'confirmada', notas: 'Revisión anual' },
  { id: 2, especialidad: 'derma', profesional: 'p2', paciente: 'María Gómez', fecha: addDays(new Date(), 1), hora: '11:00', duracion: 20, estado: 'pendiente', notas: '' },
  { id: 3, especialidad: 'pedi', profesional: 'p3', paciente: 'Familia Rivera', fecha: addDays(new Date(), 2), hora: '14:00', duracion: 30, estado: 'confirmada', notas: 'Vacunación' },
];

function addDays(d, days) { const r = new Date(d); r.setDate(r.getDate() + days); return r; }
function formatDate(d) { const dt = new Date(d); return dt.toLocaleDateString(); }

document.addEventListener('DOMContentLoaded', () => {
  poblarSelects();
  renderCalendar();
  renderListado();
  setupFormValidation();
});

function poblarSelects() {
  const selEsp = document.getElementById('especialidad');
  const filterEsp = document.getElementById('filterEspecialidad');
  especialidades.forEach(e => {
    const opt = document.createElement('option'); opt.value = e.id; opt.textContent = e.nombre; selEsp.appendChild(opt);
    const opt2 = opt.cloneNode(true); filterEsp.appendChild(opt2);
  });

  const selProf = document.getElementById('profesional');
  const filterProf = document.getElementById('filterProfesional');
  profesionales.forEach(p => {
    const opt = document.createElement('option'); opt.value = p.id; opt.textContent = p.nombre; selProf.appendChild(opt);
    const opt2 = opt.cloneNode(true); filterProf.appendChild(opt2);
  });

  // Bind filtros
  document.getElementById('filterEspecialidad').addEventListener('change', renderCalendar);
  document.getElementById('filterProfesional').addEventListener('change', renderCalendar);
  document.getElementById('filterEstado').addEventListener('change', renderCalendar);
  document.getElementById('btnLimpiarFiltros').addEventListener('click', () => {
    document.getElementById('filterEspecialidad').value = '';
    document.getElementById('filterProfesional').value = '';
    document.getElementById('filterEstado').value = '';
    renderCalendar();
  });
}

let startOfWeek = new Date();
function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';
  const weekLabel = document.getElementById('weekLabel');
  weekLabel.textContent = `Semana desde ${formatDate(startOfWeek)}`;

  const fEsp = document.getElementById('filterEspecialidad').value;
  const fProf = document.getElementById('filterProfesional').value;
  const fEstado = document.getElementById('filterEstado').value;

  for (let i = 0; i < 7; i++) {
    const day = addDays(startOfWeek, i);
    const dayBox = document.createElement('article');
    dayBox.className = 'calendar-day';
    dayBox.setAttribute('role', 'listitem');
    dayBox.innerHTML = `<h3 class="h6">${day.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</h3>`;

    const citasDelDia = citas.filter(c => new Date(c.fecha).toDateString() === day.toDateString())
      .filter(c => fEsp ? c.especialidad === fEsp : true)
      .filter(c => fProf ? c.profesional === fProf : true)
      .filter(c => fEstado ? c.estado === fEstado : true);

    citasDelDia.forEach(c => {
      const prof = profesionales.find(p => p.id === c.profesional);
      const badge = document.createElement('button');
      badge.type = 'button';
      badge.className = `appointment-badge appt-status-${c.estado}`;
      badge.setAttribute('aria-label', `${c.paciente} con ${prof ? prof.nombre : ''} a las ${c.hora}`);
      badge.textContent = `${c.hora} • ${c.paciente}`;
      badge.addEventListener('click', () => abrirDetalle(c.id));
      dayBox.appendChild(badge);
    });

    grid.appendChild(dayBox);
  }

  const hoy = new Date();
  const resumen = citas.filter(c => new Date(c.fecha).toDateString() === hoy.toDateString()).length;
  document.getElementById('todaySummary').textContent = `${resumen} citas hoy`;
}

function renderListado() {
  const tbody = document.querySelector('#tablaCitas tbody');
  tbody.innerHTML = '';
  citas.forEach((c, idx) => {
    const esp = especialidades.find(e => e.id === c.especialidad)?.nombre || c.especialidad;
    const prof = profesionales.find(p => p.id === c.profesional)?.nombre || c.profesional;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${esp}</td>
      <td>${prof}</td>
      <td>${c.paciente}</td>
      <td>${new Date(c.fecha).toLocaleDateString()}</td>
      <td>${c.hora}</td>
      <td>${c.duracion} min</td>
      <td>${c.estado}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="abrirDetalle(${c.id})">Ver</button>
        <button class="btn btn-sm btn-outline-secondary" onclick="editarCita(${c.id})">Editar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirDetalle(id) {
  const c = citas.find(x => x.id === id);
  if (!c) return;
  document.getElementById('d_especialidad').textContent = especialidades.find(e => e.id === c.especialidad)?.nombre;
  document.getElementById('d_profesional').textContent = profesionales.find(p => p.id === c.profesional)?.nombre;
  document.getElementById('d_paciente').textContent = c.paciente;
  document.getElementById('d_fecha_hora').textContent = `${new Date(c.fecha).toLocaleDateString()} ${c.hora}`;
  document.getElementById('d_duracion').textContent = `${c.duracion} min`;
  document.getElementById('d_estado').textContent = c.estado;
  document.getElementById('d_notas').textContent = c.notas || '-';

  const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
  modal.show();

  document.getElementById('btnReprogramar').onclick = () => {
    modal.hide();
    editarCita(id);
    const modalC = new bootstrap.Modal(document.getElementById('modalCita'));
    modalC.show();
  };

  document.getElementById('btnCancelarCita').onclick = () => {
    if (confirm('¿Desea cancelar esta cita?')) {
      c.estado = 'cancelada';
      renderCalendar();
      renderListado();
      modal.hide();
    }
  };
}

function editarCita(id) {
  const c = citas.find(x => x.id === id);
  if (!c) return;
  document.getElementById('modalCitaLabel').textContent = 'Editar cita';
  document.getElementById('citaId').value = c.id;
  document.getElementById('especialidad').value = c.especialidad;
  document.getElementById('profesional').value = c.profesional;
  document.getElementById('paciente').value = c.paciente;
  document.getElementById('fecha').valueAsDate = new Date(c.fecha);
  document.getElementById('hora').value = c.hora;
  document.getElementById('duracion').value = c.duracion;
  document.getElementById('estado').value = c.estado;
  document.getElementById('notas').value = c.notas;

  const modal = new bootstrap.Modal(document.getElementById('modalCita'));
  modal.show();
}

document.getElementById('formCita').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!this.checkValidity()) { this.classList.add('was-validated'); return; }

  const id = document.getElementById('citaId').value;
  const data = {
    id: id ? parseInt(id, 10) : (citas.length ? Math.max(...citas.map(x => x.id)) + 1 : 1),
    especialidad: document.getElementById('especialidad').value,
    profesional: document.getElementById('profesional').value,
    paciente: document.getElementById('paciente').value.trim(),
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    duracion: parseInt(document.getElementById('duracion').value || '30', 10),
    estado: document.getElementById('estado').value,
    notas: document.getElementById('notas').value.trim(),
  };

  if (id) {
    const idx = citas.findIndex(x => x.id === data.id);
    citas[idx] = data;
  } else {
    citas.push(data);
  }

  this.reset(); this.classList.remove('was-validated'); document.getElementById('citaId').value = '';
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalCita'));
  modal.hide();
  renderCalendar();
  renderListado();
});

function setupFormValidation() {
  const form = document.getElementById('formCita');
  form.addEventListener('input', () => {
    if (form.classList.contains('was-validated')) {
      form.reportValidity();
    }
  });
}

document.getElementById('toggleView').addEventListener('click', () => {
  const cal = document.querySelector('section[aria-labelledby="calTitle"]');
  const list = document.getElementById('listado');
  cal.classList.toggle('visually-hidden');
  list.classList.toggle('visually-hidden');
});

document.getElementById('prevWeek').addEventListener('click', () => { startOfWeek.setDate(startOfWeek.getDate() - 7); renderCalendar(); });
document.getElementById('nextWeek').addEventListener('click', () => { startOfWeek.setDate(startOfWeek.getDate() + 7); renderCalendar(); });
