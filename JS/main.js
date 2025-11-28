/**
 * @file Control principal del juego RPG.
 * @description Gestiona escenas, mercado, enemigos, inventario y combates.
 * @author Luis Gordillo Rodriguez
 */
import { Jugador } from "./clases/Jugador.js";
import { Enemigo } from "./clases/Enemigo.js";
import { Jefe } from "./clases/Jefe.js";
import { Producto } from "./clases/Producto.js";
import { listaProductos } from "./modulos/Mercado.js";
import { combate } from "./modulos/Batalla.js";
import { distinguirJugador } from "./modulos/Ranking.js";
import { RAREZAS } from "./constantes.js";

/** Botones principales de la interfaz */
const btnEscena1 = document.getElementById("btn-ir-mercado");
const btnEscena2 = document.getElementById("btn-fin-compra");
const btnEscena3 = document.getElementById("btn-ir-enemigos");
const btnEscena4 = document.getElementById("btn-comenzar-batalla");
const btnEscena5 = document.getElementById("btn-siguiente-batalla");
const btnEscena6 = document.getElementById("btn-reiniciar");

/**
 * Contenedor de elementos UI principales.
 * @type {{ mercado: HTMLElement, enemigos: HTMLElement, areaCombate: HTMLElement, inventarioFooter: HTMLElement, puntuacionFinal: HTMLElement, mensajeRango: HTMLElement, imagenesAvatar: NodeListOf }}
 */
const elementosUI = {
    mercado: document.getElementById("mercado-container"),
    enemigos: document.getElementById("enemigos-container"),
    areaCombate: document.getElementById("area-combate"),
    inventarioFooter: document.getElementById("inventory-container"),
    puntuacionFinal: document.getElementById("puntuacion-final"),
    mensajeRango: document.getElementById("mensaje-rango"),
    imagenesAvatar: document.querySelectorAll('img[alt="Avatar Jugador"]')
};

/**
 * Elementos donde se muestran las estadísticas finales.
 */
const statsFin = {
    ataque: document.getElementById("stat-ataque-fin"),
    defensa: document.getElementById("stat-defensa-fin"),
    vida: document.getElementById("stat-vida-fin"),
    puntos: document.getElementById("stat-puntos-fin")
};

/** Conjunto de escenas del juego */
const escenas = document.querySelectorAll(".escena");

let jugador;
let carrito = [];
let enemigosActivos = [];
let indiceEnemigoActual = 0;

/**
 * Lista de enemigos que aparecerán durante el juego.
 * @type {{nombre: string, img: string, ataque: number, vida: number, jefe: boolean}[]}
 */
const datosEnemigos = [
    { nombre: "Goblin", img: "./img/Enemigos/Goblin.png", ataque: 15, vida: 50, jefe: false },
    { nombre: "Golem", img: "./img/Enemigos/Golem.png", ataque: 20, vida: 100, jefe: false },
    { nombre: "Orco", img: "./img/Enemigos/Orco.png", ataque: 25, vida: 80, jefe: false },
    { nombre: "Dragón", img: "./img/Enemigos/Dragon.png", ataque: 40, vida: 150, jefe: true }
];

/**
 * Inicializa los valores del juego, crea al jugador y carga la escena inicial.
 * @function
 */
function iniciarJuego() {
    jugador = new Jugador("Cazador", "./img/personaje/cazador.png");
    carrito = [];
    enemigosActivos = [];
    indiceEnemigoActual = 0;

    elementosUI.imagenesAvatar.forEach(img => {
        img.src = jugador.avatar;
        img.style.display = 'block';
    });

    document.getElementById("stat-ataque-inicio").textContent = jugador.ataqueTotal();
    document.getElementById("stat-defensa-inicio").textContent = jugador.defensaTotal();
    document.getElementById("stat-vida-inicio").textContent = jugador.vida;

    renderizarFooterInventario([]);
    cambiarEscena("escena-1");
}

/**
 * Cambia la escena visible del juego.
 * @param {string} idEscena - ID del contenedor de la escena a mostrar.
 */
function cambiarEscena(idEscena) {
    escenas.forEach(escena => escena.style.display = "none");
    document.getElementById(idEscena).style.display = "flex"; 
}

/**
 * Actualiza el apartado de estadísticas con los valores del jugador.
 * @param {Object} contenedorStats - Elementos DOM donde escribir las estadísticas.
 */
function actualizarStats(contenedorStats) {
    contenedorStats.ataque.textContent = jugador.ataqueTotal();
    contenedorStats.defensa.textContent = jugador.defensaTotal();
    contenedorStats.vida.textContent = jugador.vidaTotal() + jugador.vida;
    if (contenedorStats.puntos) contenedorStats.puntos.textContent = jugador.puntos;
}

btnEscena1.addEventListener("click", () => {
    renderizarMercado();
    cambiarEscena("escena-2");
});

/**
 * Renderiza los productos del mercado incluyendo posibles descuentos por rareza.
 * @function
 */
function renderizarMercado() {
    elementosUI.mercado.innerHTML = "";

    const valoresRarezas = Object.values(RAREZAS);
    const rarezaOferta = valoresRarezas[Math.floor(Math.random() * valoresRarezas.length)];

    const productosDelMomento = listaProductos.map(p => {
        let nuevoP = new Producto(p.nombre, p.imagen, p.precio, p.rareza, p.tipo, p.bonus);
        if (nuevoP.rareza === rarezaOferta) {
            nuevoP.aplicarDescuento(20);
        }
        return nuevoP;
    });

    productosDelMomento.forEach((prod) => {
        const card = document.createElement("div");
        card.className = "producto-card";

        const textoPrecio = prod.rareza === rarezaOferta ? 
        `<span class="texto-oferta">${prod.precio}€ (Oferta!)</span>` : `${prod.precio}€`;
        let claseBonus = "";
        let tipoLowerCase = prod.tipo.toLowerCase();
        
        if (tipoLowerCase.includes("armadura")) {
            claseBonus = "texto-defensa"; // Azul
        } else if (tipoLowerCase.includes("consumible")) {
            claseBonus = "texto-vida";   // Verde
        } else if (tipoLowerCase.includes("arma")) {
            claseBonus = "texto-ataque"; // Rojo
        }

        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="img-producto">
            <h4>${prod.nombre}</h4>
            <p>Tipo: ${prod.tipo}</p>
            <p>Bonus: <span class="${claseBonus}">+${prod.bonus}</span></p>
            <p>${textoPrecio}</p>
            <button class="btn-agregar">Añadir</button>
        `;

        const btnAdd = card.querySelector(".btn-agregar");
        btnAdd.addEventListener("click", () => {
            cambiarCarrito(prod, btnAdd, card);
        });

        elementosUI.mercado.appendChild(card);
    });
}

/**
 * Añade o retira un producto del carrito.
 * @param {Producto} producto - Producto seleccionado.
 * @param {HTMLElement} boton - Botón pulsado.
 * @param {HTMLElement} card - Tarjeta del producto.
 */
function cambiarCarrito(producto, boton, card) {
    const index = carrito.indexOf(producto);

    if (index === -1) {
        carrito.push(producto);
        boton.textContent = "Retirar";
        boton.style.backgroundColor = "#d32f2f";
        boton.style.color = "white";
        card.style.backgroundColor = "#e0f2f1";
    } else {
        carrito.splice(index, 1);
        boton.textContent = "Añadir";
        boton.style.backgroundColor = "";
        boton.style.color = "";
        card.style.backgroundColor = "";
    }
    renderizarFooterInventario(carrito);
}

/**
 * Muestra graficamente los objetos del inventario.
 * @param {Producto[]} items - Lista de objetos a renderizar.
 */
function renderizarFooterInventario(items) {
    elementosUI.inventarioFooter.innerHTML = "";
    items.forEach(item => {
        const box = document.createElement("div");
        box.className = "item-inventario";
        const img = document.createElement("img");
        img.src = item.imagen;
        img.alt = item.nombre;
        box.appendChild(img);
        box.title = item.nombre;
        elementosUI.inventarioFooter.appendChild(box);
    });
}

btnEscena2.addEventListener("click", () => {
    carrito.forEach(prod => jugador.agregarInventario(prod));
    actualizarStats(statsFin);
    renderizarFooterInventario(jugador.inventario);
    cambiarEscena("escena-3");
});

btnEscena3.addEventListener("click", () => {
    prepararEnemigos();
    cambiarEscena("escena-4");
});

/**
 * Prepara todos los enemigos para la fase de batalla.
 */
function prepararEnemigos() {
    elementosUI.enemigos.innerHTML = "";
    enemigosActivos = [];

    datosEnemigos.forEach(dato => {
        let nuevoEnemigo;
        if (dato.jefe) {
            nuevoEnemigo = new Jefe(dato.nombre, dato.img, dato.ataque, dato.vida);
        } else {
            nuevoEnemigo = new Enemigo(dato.nombre, dato.img, dato.ataque, dato.vida);
        }
        enemigosActivos.push(nuevoEnemigo);

        const card = document.createElement("div");
        card.className = "enemigo-card";
        card.innerHTML = `
            <img src="${dato.img}" alt="${dato.nombre}" class="img-enemigo">
            <h3>${dato.nombre}</h3>
            <p>Ataque: <span class="texto-ataque">${dato.ataque}</span></p>
            <p>Vida: <span class="texto-vida">${dato.vida}</span></p>
        `;
        elementosUI.enemigos.appendChild(card);
    });
}

btnEscena4.addEventListener("click", () => {
    cambiarEscena("escena-5");
    gestionarBatalla();
});

/**
 * Gestiona una batalla contra el enemigo actual.
 */
function gestionarBatalla() {
    if (indiceEnemigoActual >= enemigosActivos.length || jugador.vida <= 0) {
        finalizarJuego();
    } else {
        const enemigo = enemigosActivos[indiceEnemigoActual];

        elementosUI.areaCombate.innerHTML = `
        <h3 style="color:gold">VS ${enemigo.nombre}</h3>
        
        <div class="batalla-visual">
            <div class="lado-jugador">
                 <img src="${jugador.avatar}" alt="Jugador" class="img-batalla anim-entrada-izq">
                 <div>Tú</div>
            </div>
            <div class="lado-enemigo">
                 <img src="${enemigo.avatar}" alt="${enemigo.nombre}" class="img-batalla anim-entrada-der">
                 <div>${enemigo.nombre}</div>
            </div>
        </div>

        <div class="vs-container">
             <div><span id="vida-jugador-combate" class="texto-vida">${jugador.vida}</span> HP</div>
             <p>¡Luchando!...</p>
             <div><span class="texto-vida">${enemigo.vida}</span> HP</div>
        </div>
        
    `;

        combate(enemigo, jugador);

        setTimeout(() => {
            mostrarResultadoCombate(enemigo);
        }, 3000);
    }
}

/**
 * Muestra el resultado de la batalla y controla el botón para avanzar.
 * @param {Enemigo|Jefe} enemigo - Enemigo enfrentado.
 */
function mostrarResultadoCombate(enemigo) {
    let htmlResultado = "";
    let btnText = "";
    let btnAction = null;

    if (jugador.vida > 0) {
        htmlResultado = `
            <h2 style="color:#76ff03">¡VICTORIA!</h2>
            <p>Has derrotado a ${enemigo.nombre}.</p>
            <p>Puntos Totales: <span class="texto-puntos">${jugador.puntos}</span></p>
            <p>Vida restante: <span class="texto-vida">${jugador.vida}</span></p>
        `;

        if (indiceEnemigoActual === enemigosActivos.length - 1) {
            btnText = "Ver Resultados Finales";
            btnAction = finalizarJuego;
        } else {
            btnText = "Siguiente Enemigo";
            btnAction = () => {
                indiceEnemigoActual++;
                gestionarBatalla();
            };
        }
    } else {
        htmlResultado = `
            <h2 style="color:#ff1744">HAS MUERTO</h2>
            <p>${enemigo.nombre} te ha aniquilado.</p>
        `;
        btnText = "Terminar Partida";
        btnAction = finalizarJuego;
    }

    elementosUI.areaCombate.innerHTML = htmlResultado;

    btnEscena5.textContent = btnText;
    btnEscena5.onclick = btnAction;
}

/**
 * Finaliza el juego y muestra la puntuación y el rango obtenido.
 */
function finalizarJuego() {
    const rango = distinguirJugador(jugador.puntos);
    elementosUI.puntuacionFinal.textContent = jugador.puntos;
    elementosUI.puntuacionFinal.className = "texto-puntos";
    elementosUI.mensajeRango.innerHTML = `Rango alcanzado: <strong style="color:gold; font-size:1.5em">${rango}</strong>`;
    cambiarEscena("escena-6");
}

btnEscena6.addEventListener("click", () => {
    iniciarJuego();
});

iniciarJuego();