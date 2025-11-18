document.addEventListener("DOMContentLoaded", () => {

    const tablaHeader = document.getElementById("headerDias");
    const cuerpoAgenda = document.getElementById("cuerpoAgenda");
    const fechaSemana = document.getElementById("fechaSemana");
    const selectMedico = document.getElementById("selectMedico");
    const btnHoy = document.getElementById("btnHoy");

    // Horarios configurables
    const horaInicio = 7;   // 07:00
    const horaFin = 17;     // 17:00
    const intervalo = 30;   // 30 minutos

    // ==============================
    // FECHA INICIAL = HOY
    // ==============================
    const hoy = new Date();
    fechaSemana.value = hoy.toISOString().slice(0, 10);

    generarSemana();
    generarHoras();
    cargarCitas();

    // ==============================
    // EVENTOS
    // ==============================
    fechaSemana.addEventListener("change", () => {
        generarSemana();
        generarHoras();
        cargarCitas();
    });

    selectMedico.addEventListener("change", cargarCitas);

    btnHoy.addEventListener("click", () => {
        fechaSemana.value = new Date().toISOString().slice(0, 10);
        generarSemana();
        generarHoras();
        cargarCitas();
    });

    // ==============================
    // GENERAR CABECERA DE DÍAS
    // ==============================
    function generarSemana() {
        tablaHeader.innerHTML = "";

        const base = new Date(fechaSemana.value);
        const lunes = new Date(base.setDate(base.getDate() - base.getDay() + 1));

        const thHora = document.createElement("th");
        thHora.textContent = "Hora";
        tablaHeader.appendChild(thHora);

        for (let i = 0; i < 6; i++) {
            const dia = new Date(lunes);
            dia.setDate(lunes.getDate() + i);

            const th = document.createElement("th");
            th.textContent = dia.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric"
            });
            th.dataset.fecha = dia.toISOString().slice(0, 10);
            tablaHeader.appendChild(th);
        }
    }

    // ==============================
    // GENERAR FILAS DE HORAS
    // ==============================
    function generarHoras() {
        cuerpoAgenda.innerHTML = "";

        for (let h = horaInicio; h <= horaFin; h++) {
            for (let m = 0; m < 60; m += intervalo) {

                const tr = document.createElement("tr");

                const tdHora = document.createElement("td");
                tdHora.classList.add("hour-cell");
                tdHora.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                tr.appendChild(tdHora);

                for (let d = 1; d <= 6; d++) {
                    const td = document.createElement("td");
                    td.classList.add("slot");
                    td.dataset.hora = tdHora.textContent;
                    td.dataset.dia = d;
                    tr.appendChild(td);
                }

                cuerpoAgenda.appendChild(tr);
            }
        }
    }

    // ==============================
    // CARGAR CITAS DE LA API
    // ==============================
    async function cargarCitas() {
        limpiarCitas();

        const medico_id = selectMedico.value;
        const fecha = fechaSemana.value;

        const resp = await fetch(`/api/citas/semana?medico_id=${medico_id}&fecha=${fecha}`);
        const citas = await resp.json();

        citas.forEach(c => pintarCita(c));
    }

    // ==============================
    // LIMPIAR TABLA
    // ==============================
    function limpiarCitas() {
        document.querySelectorAll(".cita-card").forEach(el => el.remove());
    }

    // ==============================
    // PINTAR UNA CITA EN LA TABLA
    // ==============================
    function pintarCita(cita) {

        const fechaCita = new Date(cita.fecha);
        const base = new Date(fechaSemana.value);
        const lunes = new Date(base.setDate(base.getDate() - base.getDay() + 1));

        const diffDias = Math.floor((fechaCita - lunes) / (1000 * 60 * 60 * 24));
        if (diffDias < 0 || diffDias > 5) return;

        const hora = cita.hora.slice(0, 5);

        const celda = Array.from(document.querySelectorAll(`#cuerpoAgenda td`))
            .find(td => td.dataset.hora === hora && td.dataset.dia == diffDias + 1);

        if (!celda) return;

        const div = document.createElement("div");
        div.classList.add("cita-card");
        div.textContent = `${cita.paciente}`;

        div.onclick = () => window.location.href = `/citas/registrar?editar=${cita.id}`;

        celda.appendChild(div);
    }

});
div.classList.add("cita-card");

// colores por estado
div.classList.add(`cita-${cita.estado.toLowerCase()}`);

// colores por especialidad
if (cita.especialidad_id == 1) div.classList.add("esp-general");
if (cita.especialidad_id == 2) div.classList.add("esp-pediatria");
if (cita.especialidad_id == 3) div.classList.add("esp-odontologia");
