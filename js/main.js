// Array de modelos permitidos por marca
const modelosPermitidos = {
    Volkswagen: ['Up', 'Gol', 'Polo', 'Taos', 'Amarok', 'Ranger'],
    Toyota: ['Etios', 'Yaris', 'Corolla', 'Corolla Cros', 'Hilux', 'SW4'],
    Chevrolet: ['Onix', 'Civic', 'Cruze', 'Tracker'],
    Ford: ['Fiesta', 'Focus', 'Ecosport'],
    MercedesBenz: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE'],
    Audi: ['A1', 'A3', 'A4', 'A6', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8'],
    Lexus: ['UX', 'NX', 'ES', 'LS', 'LC'],
    Porsche: ['911', '718', 'Panamera', 'Macan', 'Taycan']
};

// Listas de marcas
const marcasLujo = ['MercedesBenz', 'Audi', 'Lexus', 'Porsche'];
const marcasEconomicas = ['Toyota', 'Ford', 'Chevrolet', 'Volkswagen'];

// Configuración de precios base
const precioBase = 100000;

// Función para obtener y capitalizar la entrada del usuario
function obtenerEntrada(promptText) {
    return prompt(promptText).trim();
}

// Función para validar los datos ingresados
function validarDatos(nombre, apellido, marca, modelo, año) {
    if (!nombre || !apellido || !marca || !modelo || isNaN(año) || año < 1900 || año > 2024) {
        alert('Por favor, complete todos los campos correctamente.');
        console.log('Error: Datos incompletos o inválidos.');
        return false;
    }
    return true;
}

// Función para capitalizar la primera letra de un texto
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Función para validar el modelo ingresado usando un ciclo for
function validarModelo(marca, modelo) {
    const marcaCapitalizada = capitalizar(marca);
    const modeloCapitalizado = capitalizar(modelo);

    console.log(`Marca ingresada: ${marcaCapitalizada}`);
    console.log(`Modelo ingresado: ${modeloCapitalizado}`);

    if (modelosPermitidos[marcaCapitalizada]) {
        const modelos = modelosPermitidos[marcaCapitalizada];
        for (let i = 0; i < modelos.length; i++) {
            if (modelos[i] === modeloCapitalizado) {
                return true;
            }
        }
    }
    return false;
}

// Función para calcular el factor de marca
function obtenerFactorMarca(marca) {
    const marcaCapitalizada = capitalizar(marca);
    if (marcasLujo.includes(marcaCapitalizada)) {
        return 1.5; // Ejemplo: marca de lujo
    } else if (marcasEconomicas.includes(marcaCapitalizada)) {
        return 0.8; // Ejemplo: marca económica
    }
    return 1;
}

// Función para calcular el factor de año
function obtenerFactorAño(año) {
    const añoActual = new Date().getFullYear();
    const edadVehiculo = añoActual - año;

    if (edadVehiculo < 5) {
        return 1; // Vehículo nuevo
    } else if (edadVehiculo >= 5 && edadVehiculo <= 10) {
        return 1.2; // Vehículo de edad media
    } else {
        return 1.5; // Vehículo antiguo
    }
}

// Función principal para calcular y mostrar la cotización
function calcularCotizacion() {
    const nombre = obtenerEntrada('Ingrese su nombre:');
    const apellido = obtenerEntrada('Ingrese su apellido:');
    const marca = obtenerEntrada('Ingrese la marca del vehículo:');
    const modelo = obtenerEntrada('Ingrese el modelo del vehículo:');
    const año = parseInt(obtenerEntrada('Ingrese el año del vehículo:'), 10);

    if (!validarDatos(nombre, apellido, marca, modelo, año)) return;

    if (!validarModelo(marca, modelo)) {
        alert('El modelo ingresado no es válido. Por favor, ingrese un modelo permitido.');
        console.log('Error: Modelo ingresado no es válido.');
        return;
    }

    const factorMarca = obtenerFactorMarca(marca);
    const factorAño = obtenerFactorAño(año);

    // Calcular precios de cobertura
    const coberturaTerceros = precioBase * factorMarca * factorAño * 1.1;
    const coberturaBasica = precioBase * factorMarca * factorAño * 1.3;
    const coberturaTodoRiesgo = precioBase * factorMarca * factorAño * 1.6;

    // Mostrar el resultado
    const resultado = `
    Cotización para ${nombre} ${apellido}
    Marca: ${capitalizar(marca)}
    Modelo: ${capitalizar(modelo)}
    Año: ${año}
    Cobertura Contra Terceros: $${coberturaTerceros.toFixed(2)}
    Cobertura Básica: $${coberturaBasica.toFixed(2)}
    Cobertura Todo Riesgo: $${coberturaTodoRiesgo.toFixed(2)}
    `;

    alert(resultado);
    console.log('Cotización generada:');
    console.log(resultado);
}

// Ejecutar la función principal
calcularCotizacion();
