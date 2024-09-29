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
    constructor(nombre, apellido, marca, modelo, año) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.marca = capitalizar(marca);
        this.modelo = capitalizar(modelo);
        this.año = año;
    }

    calcularCoberturas(precioBase) {
        const factorMarca = this.obtenerFactorMarca();
        const factorAño = this.obtenerFactorAño();

        return {
            coberturaTerceros: precioBase * factorMarca * factorAño * 1.1,
            coberturaBasica: precioBase * factorMarca * factorAño * 1.3,
            coberturaTodoRiesgo: precioBase * factorMarca * factorAño * 1.6,
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

    obtenerFactorAño() {
        const añoActual = new Date().getFullYear();
        const edadVehiculo = añoActual - this.año;

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
    resultDiv.innerHTML = 
        `<h2>Cotización para ${cotizacion.nombre} ${cotizacion.apellido}</h2>
        <p>Marca: ${cotizacion.marca}</p>
        <p>Modelo: ${cotizacion.modelo}</p>
        <p>Año: ${cotizacion.año}</p>
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

function mostrarCotizacionesGuardadas(nombre, apellido) {
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizaciones')) || [];
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
            resultDiv.innerHTML += `<li>${cot.nombre} ${cot.apellido} - ${cot.marca} ${cot.modelo} (${cot.año})</li>`;
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
    const año = parseInt(document.getElementById('año').value, 10);

    const modelosPermitidos = new ModelosPermitidos();

    if (!validarDatos(nombre, apellido, marca, modelo, año)) return;

    if (!modelosPermitidos.esModeloValido(marca, modelo)) {
        mostrarError('El modelo ingresado no es válido. Por favor, ingrese un modelo permitido.');
        return;
    }

    const cotizacion = new Cotizacion(nombre, apellido, marca, modelo, año);
    const coberturas = cotizacion.calcularCoberturas(100000); // precioBase

    mostrarResultado(cotizacion, coberturas);
    guardarCotizacion(cotizacion, coberturas);
    mostrarCotizacionesGuardadas(nombre, apellido); // Pasar nombre y apellido para filtrar
});

// Función para validar datos ingresados
function validarDatos(nombre, apellido, marca, modelo, año) {
    if (!nombre || !apellido || !marca || !modelo || isNaN(año) || año < 1900 || año > new Date().getFullYear()) {
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

