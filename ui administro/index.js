// Almacenamiento y variables globales
let cargadores = JSON.parse(localStorage.getItem('cargadores')) || [];
let cargadorEditando = null;

// Elementos del DOM
const form = document.querySelector('form');
const tablaCargadores = document.getElementById('cargadoresTableBody');
const numCargadoresEl = document.getElementById('numCargadores');
const cargadoresDisponiblesEl = document.getElementById('cargadoresDisponibles');
const cargadoresMantenimientoEl = document.getElementById('cargadoresMantenimiento');

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarTablaCargadores();
    actualizarEstadisticas();
});

// Manejar envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cargador = {
        id: document.getElementById('ID').value,
        localizacion: document.getElementById('localizacion').value,
        tipo: document.getElementById('tipo').value,
        potencia: document.getElementById('potencia').value,
        estado: document.getElementById('estado').value
    };

    // Verificar si es edición o nuevo registro
    if (cargadorEditando) {
        // Actualizar cargador existente
        const index = cargadores.findIndex(c => c.id === cargadorEditando);
        if (index !== -1) {
            cargadores[index] = cargador;
        }
        cargadorEditando = null;
        document.querySelector('button[type="submit"]').textContent = 'Añadir Cargador';
    } else {
        // Verificar si el ID ya existe
        if (cargadores.some(c => c.id === cargador.id)) {
            alert('Ya existe un cargador con ese ID');
            return;
        }
        // Añadir nuevo cargador
        cargadores.push(cargador);
    }

    // Guardar y actualizar UI
    guardarCargadores();
    actualizarTablaCargadores();
    actualizarEstadisticas();
    form.reset();
});

// Actualizar la tabla de cargadores
function actualizarTablaCargadores() {
    tablaCargadores.innerHTML = '';

    cargadores.forEach(cargador => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${cargador.id}</td>
            <td>${cargador.localizacion}</td>
            <td>${cargador.tipo}</td>
            <td>${cargador.potencia} W</td>
            <td>${cargador.estado}</td>
            <td>
                <button class="accion-btn editar" data-id="${cargador.id}">Editar</button>
                <button class="accion-btn eliminar" data-id="${cargador.id}">Eliminar</button>
            </td>
        `;

        tablaCargadores.appendChild(tr);
    });

    // Añadir eventos a los botones
    document.querySelectorAll('.accion-btn.editar').forEach(btn => {
        btn.addEventListener('click', editarCargador);
    });

    document.querySelectorAll('.accion-btn.eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarCargador);
    });
}

// Editar cargador
function editarCargador(e) {
    const id = e.target.getAttribute('data-id');
    const cargador = cargadores.find(c => c.id === id);

    if (cargador) {
        // Rellenar el formulario con los datos del cargador
        document.getElementById('ID').value = cargador.id;
        document.getElementById('localizacion').value = cargador.localizacion;
        document.getElementById('tipo').value = cargador.tipo;
        document.getElementById('potencia').value = cargador.potencia;
        document.getElementById('estado').value = cargador.estado;

        // Cambiar el botón a "Actualizar"
        document.querySelector('button[type="submit"]').textContent = 'Actualizar Cargador';

        cargadorEditando = id;
    }
}

// Eliminar cargador
function eliminarCargador(e) {
    if (confirm('¿Estás seguro de eliminar este cargador?')) {
        const id = e.target.getAttribute('data-id');
        cargadores = cargadores.filter(c => c.id !== id);

        guardarCargadores();
        actualizarTablaCargadores();
        actualizarEstadisticas();
    }
}

// Guardar en localStorage
function guardarCargadores() {
    localStorage.setItem('cargadores', JSON.stringify(cargadores));
}

// Actualizar estadísticas en los cuadros informativos
function actualizarEstadisticas() {
    numCargadoresEl.textContent = cargadores.length;

    const disponibles = cargadores.filter(c => c.estado === 'disponible').length;
    cargadoresDisponiblesEl.textContent = disponibles;

    const mantenimiento = cargadores.filter(c => c.estado === 'mantenimiento').length;
    cargadoresMantenimientoEl.textContent = mantenimiento;
}