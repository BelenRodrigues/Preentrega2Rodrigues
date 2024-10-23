// Clase para gestionar los modelos permitidos
class ModelosPermitidos {
    constructor() {
        this.modelos = {
            Volkswagen: ['Up', 'Gol', 'Polo', 'Taos', 'Amarok', 'Ranger'],
            Toyota: ['Etios', 'Yaris', 'Corolla', 'Corolla Cros', 'Hilux', 'SW4'],
            Chevrolet: ['Onix', 'Civic', 'Cruze', 'Tracker'],
            Ford: ['Fiesta', 'Focus', 'Ecosport'],
            MercedesBenz: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE'],
            Audi: ['A1', 'A3', 'A4', 'A6', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8'],
            Lexus: ['UX', 'NX', 'ES', 'LS', 'LC'],
            Porsche: ['911', '718', 'Panamera', 'Macan', 'Taycan']
        };
    }

    esModeloValido(marca, modelo) {
        const modelosMarca = this.modelos[capitalizar(marca)];
        return modelosMarca && modelosMarca.includes(capitalizar(modelo));
    }

    obtenerModelos(marca) {
        return this.modelos[capitalizar(marca)] || [];
    }
}

// Clase para gestionar las cotizaciones
class Cotizacion {
    constructor(nombre, apellido, marca, modelo, anio) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.marca = capitalizar(marca);
        this.modelo = capitalizar(modelo);
        this.anio = anio;
    }

    calcularCoberturas(precioBase) {
        const factorMarca = this.obtenerFactorMarca();
        const factorAnio = this.obtenerFactorAnio();

        return {
            coberturaTerceros: precioBase * factorMarca * factorAnio * 1.1,
            coberturaBasica: precioBase * factorMarca * factorAnio * 1.3,
            coberturaTodoRiesgo: precioBase * factorMarca * factorAnio * 1.6,
        };
    }

    obtenerFactorMarca() {
        const marcasLujo = ['MercedesBenz', 'Audi', 'Lexus', 'Porsche'];
        const marcasEconomicas = ['Toyota', 'Ford', 'Chevrolet', 'Volkswagen'];

        if (marcasLujo.includes(this.marca)) {
            return 1.5; // Marca de lujo
        } else if (marcasEconomicas.includes(this.marca)) {
            return 0.8; // Marca económica
        }
        return 1; // Marca estándar
    }

    obtenerFactorAnio() {
        const anioActual = new Date().getFullYear();
        const edadVehiculo = anioActual - this.anio;

        if (edadVehiculo < 5) return 1; // Vehículo nuevo
        if (edadVehiculo <= 10) return 1.2; // Vehículo de edad media
        return 1.5; // Vehículo antiguo
    }
}

// Funciones auxiliares
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function mostrarResultado(cotizacion, coberturas) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Cotización para ${cotizacion.nombre} ${cotizacion.apellido}</h2>
        <p>Marca: ${cotizacion.marca}</p>
        <p>Modelo: ${cotizacion.modelo}</p>
        <p>Año: ${cotizacion.anio}</p>
        <p>Cobertura Contra Terceros: $${coberturas.coberturaTerceros.toFixed(2)}</p>
        <p>Cobertura Básica: $${coberturas.coberturaBasica.toFixed(2)}</p>
        <p>Cobertura Todo Riesgo: $${coberturas.coberturaTodoRiesgo.toFixed(2)}</p>`;
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = `<p>${mensaje}</p>`;
}

function guardarCotizacion(cotizacion, coberturas) {
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizaciones')) || [];
    cotizacionesGuardadas.push({ ...cotizacion, ...coberturas });
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesGuardadas));
}

// Función para manejar el botón Solicitar Ahora
const manejarSolicitarAhora = () => {
    // Mostrar un mensaje de confirmación usando SweetAlert
    Swal.fire({
        title: 'Cotización Exitosa!',
        text: 'Te estaremos contactando a la brevedad por e-mail para finalizar la gestión.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
};

// Manejador del evento para el botón "Solicitar Ahora"
document.getElementById('solicitarAhora').addEventListener('click', manejarSolicitarAhora);

// Función para obtener cotizaciones guardadas de manera asíncrona
async function obtenerCotizacionesGuardadas() {
    return new Promise((resolve) => {
        const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizaciones')) || [];
        resolve(cotizacionesGuardadas);
    });
}

// Manejador del evento para mostrar cotizaciones guardadas
document.getElementById('mostrarCotizaciones').addEventListener('click', async function () {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;

    const cotizacionesGuardadas = await obtenerCotizacionesGuardadas();
    mostrarCotizaciones(cotizacionesGuardadas, nombre, apellido);
});

// Función para mostrar cotizaciones
function mostrarCotizaciones(cotizacionesGuardadas, nombre, apellido) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML += `<h3>Cotizaciones Guardadas:</h3><ul>`;

    // Filtrar cotizaciones que coinciden con el nombre y apellido
    const cotizacionesFiltradas = cotizacionesGuardadas.filter(cot => {
        return cot.nombre === nombre && cot.apellido === apellido;
    });

    if (cotizacionesFiltradas.length === 0) {
        resultDiv.innerHTML += `<li>No hay cotizaciones guardadas para ${nombre} ${apellido}.</li>`;
    } else {
        cotizacionesFiltradas.forEach(cot => {
            resultDiv.innerHTML += `<li>${cot.nombre} ${cot.apellido} - ${cot.marca} ${cot.modelo} (${cot.anio})</li>`;
        });
    }
    resultDiv.innerHTML += `</ul>`;
}

// Manejador del evento de envío del formulario
document.getElementById('insuranceForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const anio = parseInt(document.getElementById('anio').value, 10);

    const modelosPermitidos = new ModelosPermitidos();

    if (!validarDatos(nombre, apellido, marca, modelo, anio)) return;

    if (!modelosPermitidos.esModeloValido(marca, modelo)) {
        mostrarError('El modelo ingresado no es válido. Por favor, ingrese un modelo permitido.');
        return;
    }

    const cotizacion = new Cotizacion(nombre, apellido, marca, modelo, anio);
    const coberturas = cotizacion.calcularCoberturas(100000); // precioBase

    mostrarResultado(cotizacion, coberturas);
    guardarCotizacion(cotizacion, coberturas);
});

// Función para validar datos ingresados
function validarDatos(nombre, apellido, marca, modelo, anio) {
    if (!nombre || !apellido || !marca || !modelo || isNaN(anio) || anio < 1900 || anio > new Date().getFullYear()) {
        mostrarError('Por favor, complete todos los campos correctamente.');
        return false;
    }
    return true;
}

// Llenar el select de marcas al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const modelosPermitidos = new ModelosPermitidos();
    const marcaSelect = document.getElementById('marca');
    const modeloSelect = document.getElementById('modelo');

    // Llenar marcas
    for (const marca in modelosPermitidos.modelos) {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        marcaSelect.appendChild(option);
    }

    // Llenar modelos según la marca seleccionada
    marcaSelect.addEventListener('change', function () {
        modeloSelect.innerHTML = `<option value="" disabled selected>Seleccione un modelo</option>`; // Resetear opciones

        const modelos = modelosPermitidos.obtenerModelos(marcaSelect.value);
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo;
            option.textContent = modelo;
            modeloSelect.appendChild(option);
        });
    });
});
