const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario')

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e) {
    e.preventDefault();

    // Validate inputs
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        // There was a mistake
        mostrarError('Ambos campos son obligatorios.')

        return;
    }

    // Consult API
    constultarAPI(ciudad, pais)
}

function mostrarError(mensaje) {
    // to dont repeat alerts
    const alertaRepetida = document.querySelector('.alerta')

    if (!alertaRepetida) {
        // create alert
        const alerta = document.createElement('div')

        alerta.classList.add('alerta', 'border-red-100', 'bg-red-100', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>`

        container.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }
}

function constultarAPI(ciudad, pais) {

    const appId = '148c2ba7b553c6ddb11ab984d23650fc';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    spinner(); // show charge spinner

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            limpiarHTML(); // Clean previously html

            if (datos.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return;
            }

            // Prints the html response
            mostrarClima(datos);
        })

}

function mostrarClima(datos) {
    const { main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinToCelsius(temp);
    const max = kelvinToCelsius(temp_max);
    const min = kelvinToCelsius(temp_min);

    // add actual temperature to the html
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`; // &#8451 is an HTML entity that represents the °C symbol.
    actual.classList.add('font-bold', 'text-6xl');

    // add temp max and temp min to html
    const maxMin = document.createElement('p')
    maxMin.innerHTML = `Max: ${max} &#8451; - Min: ${min} &#8451;`
    maxMin.classList.add('text-xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white', 'text-xl');
    resultadoDiv.textContent = `${ciudad.value}, ${pais.value}`
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(maxMin);

    resultado.appendChild(resultadoDiv)
}

function kelvinToCelsius(kelvin) {
    const celsius = kelvin - 273.15
    return Number(celsius.toFixed(1)) // toFixed returns a string, I've used "Number" to ensure that I have a number
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `

    resultado.appendChild(divSpinner)
}