document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEspecialidad');
    const tbody = document.getElementById('tbodyEspecialidades');
    const fechaInput = document.getElementById('fechaRegistro');
    const alerta = document.getElementById('alerta');
    const btnLimpiar = document.getElementById('btnLimpiar');

    let especialidades = [];
    let editIndex = null;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const duracion = document.getElementById('duracion').value.trim();
        const estado = document.getElementById('estado').value;

        if (!nombre || !descripcion || !duracion) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        const fechaActual = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

        const nueva = {
            nombre,
            descripcion,
            duracion,
            estado,
            fechaRegistro: editIndex === null ? fechaActual : especialidades[editIndex].fechaRegistro
        };

        if (editIndex === null) {
            especialidades.push(nueva);
            mostrarAlerta();
        } else {
            especialidades[editIndex] = nueva;
            editIndex = null;
        }

        form.reset();
        fechaInput.value = '';
        renderTabla();
        document.querySelector('button[type="submit"]').innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i> Guardar';
    });

    function renderTabla() {
        tbody.innerHTML = '';
        especialidades.forEach((esp, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${esp.nombre}</td>
                <td>${esp.descripcion}</td>
                <td>${esp.duracion} min</td>
                <td>
                    <span class="badge ${esp.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}">
                        ${esp.estado}
                    </span>
                </td>
                <td>${esp.fechaRegistro}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editar(${index})">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminar(${index})">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    window.editar = (index) => {
        const esp = especialidades[index];
        document.getElementById('nombre').value = esp.nombre;
        document.getElementById('descripcion').value = esp.descripcion;
        document.getElementById('duracion').value = esp.duracion;
        document.getElementById('estado').value = esp.estado;
        fechaInput.value = esp.fechaRegistro;

        editIndex = index;

        document.querySelector('button[type="submit"]').innerHTML =
            '<i class="fa-solid fa-rotate"></i> Actualizar';
    };

    window.eliminar = (index) => {
        if (confirm('¿Desea eliminar esta especialidad?')) {
            especialidades.splice(index, 1);
            renderTabla();
        }
    };

    btnLimpiar.addEventListener('click', () => {
        form.reset();
        fechaInput.value = '';
        editIndex = null;
        document.querySelector('button[type="submit"]').innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i> Guardar';
    });

    function mostrarAlerta() {
        alerta.classList.remove('d-none');
        setTimeout(() => {
            alerta.classList.add('d-none');
        }, 3000);
    }

    window.cerrarAlerta = () => alerta.classList.add('d-none');
});
