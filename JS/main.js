import { Jugador } from "./clases/Jugador.js";
import { Enemigo } from "./clases/Enemigo.js";
import { Jefe } from "./clases/Jefe.js";
import { Producto } from "./clases/Producto.js"; 
import { listaProductos } from "./modulos/Mercado.js";
import { combate } from "./modulos/Batalla.js";
import { distinguirJugador } from "./modulos/Ranking.js";
import { RAREZAS } from "./constantes.js";

// --- REFERENCIAS DOM ---
const btnEscena1 = document.getElementById("btn-ir-mercado");
const btnEscena2 = document.getElementById("btn-fin-compra");
const btnEscena3 = document.getElementById("btn-ir-enemigos");
const btnEscena4 = document.getElementById("btn-comenzar-batalla");
const btnEscena5 = document.getElementById("btn-siguiente-batalla");
const btnEscena6 = document.getElementById("btn-reiniciar");
const imagenJugador = document.getElementsByName("Avatar Jugador");

// Objeto para agrupar elementos
const elementosUI = {
    mercado: document.getElementById("mercado-container"),
    enemigos: document.getElementById("enemigos-container"),
    areaCombate: document.getElementById("area-combate"),
    inventarioFooter: document.getElementById("inventory-container"),
    puntuacionFinal: document.getElementById("puntuacion-final"),
    mensajeRango: document.getElementById("mensaje-rango")
};

// Elementos de stats finales
const statsFin = {
    ataque: document.getElementById("stat-ataque-fin"),
    defensa: document.getElementById("stat-defensa-fin"),
    vida: document.getElementById("stat-vida-fin"),
    puntos: document.getElementById("stat-puntos-fin")
};

const escenas = document.querySelectorAll(".escena");

// --- ESTADO DEL JUEGO ---
let jugador;
let carrito = [];
let enemigosActivos = [];
let indiceEnemigoActual = 0;

const datosEnemigos = [
    {nombre: "Goblin", img: "/img/Enemigos/Goblin.png", ataque: 15, vida: 50, jefe: false},
    {nombre: "Golem", img: "/img/Enemigos/Golem.png", ataque: 20, vida: 100, jefe: false},
    {nombre: "Orco", img: "/img/Enemigos/Orco.png", ataque: 25, vida: 80, jefe: false},
    {nombre: "Dragón", img: "/img/Enemigos/Dragon.png", ataque: 40, vida: 150, jefe: true}
];

// --- FUNCIONES ---

function iniciarJuego() {
    jugador = new Jugador("Cazador", "/img/Personaje/Cazador.png");
    imagenJugador = jugador.avatar;
    carrito = [];
    enemigosActivos = [];
    indiceEnemigoActual = 0;
    
    // Actualizar stats iniciales
    document.getElementById("stat-ataque-inicio").textContent = jugador.ataqueTotal();
    document.getElementById("stat-defensa-inicio").textContent = jugador.defensaTotal();
    document.getElementById("stat-vida-inicio").textContent = jugador.vida;

    renderizarFooterInventario([]);
    cambiarEscena("escena-1");
}

function cambiarEscena(idEscena) {
    escenas.forEach(escena => escena.style.display = "none");
    document.getElementById(idEscena).style.display = "block";
}

function actualizarStats(contenedorStats){
    contenedorStats.ataque.textContent = jugador.ataqueTotal();
    contenedorStats.defensa.textContent = jugador.defensaTotal();
    contenedorStats.vida.textContent = jugador.vidaTotal() + jugador.vida;
    if(contenedorStats.puntos) contenedorStats.puntos.textContent = jugador.puntos;
}

// ESCENA 1 -> 2 (MERCADO)
btnEscena1.addEventListener("click", () => {
    renderizarMercado();
    cambiarEscena("escena-2");
});

function renderizarMercado(){
    elementosUI.mercado.innerHTML = "";
    
    // Seleccionar rareza aleatoria para descuento
    const valoresRarezas = Object.values(RAREZAS);
    const rarezaOferta = valoresRarezas[Math.floor(Math.random() * valoresRarezas.length)];

    // Clonamos la lista de productos para no afectar la original
    const productosDelMomento = listaProductos.map(p => {
        // Crear nueva instancia para no modificar la referencia original
        let nuevoP = new Producto(p.nombre, p.imagen, p.precio, p.rareza, p.tipo, p.bonus);
        if(nuevoP.rareza === rarezaOferta) {
            nuevoP.aplicarDescuento(20); // Descuento fijo de 20
        }
        return nuevoP;
    });

    productosDelMomento.forEach((prod) => {
        const card = document.createElement("div");
        card.className = "producto-card"; 

        const textoPrecio = prod.rareza === rarezaOferta 
            ? `<span style="color:green; font-weight:bold">${prod.precio}€ (Oferta!)</span>` 
            : `${prod.precio}€`;

        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="img-producto" style="width: 50px; height: 50px;">
            <h4>${prod.nombre}</h4>
            <p>Tipo: ${prod.tipo}</p>
            <p>Bonus: +${prod.bonus}</p>
            <p>${textoPrecio}</p>
            <button class="btn-add">Añadir</button>
        `;

        const btnAdd = card.querySelector(".btn-add");
        btnAdd.addEventListener("click", () => {
            toggleCarrito(prod, btnAdd, card);
        });

        elementosUI.mercado.appendChild(card);
    });
}

function toggleCarrito(producto, boton, card) {
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

// ESCENA 2 -> 3 (RESUMEN COMPRA)
btnEscena2.addEventListener("click", () => {
    carrito.forEach(prod => jugador.agregarInventario(prod));
    actualizarStats(statsFin);
    renderizarFooterInventario(jugador.inventario);
    cambiarEscena("escena-3");
});

// ESCENA 3 -> 4 (ENEMIGOS)
btnEscena3.addEventListener("click", () => {
    prepararEnemigos();
    cambiarEscena("escena-4");
});

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
            <img src="${dato.img}" alt="${dato.nombre}" class="img-enemigo" style="width: 80px; height: 80px;">
            <h3>${dato.nombre}</h3>
            <p>⚔️ Ataque: ${dato.ataque}</p>
            <p>❤️ Vida: ${dato.vida}</p>
        `;
        elementosUI.enemigos.appendChild(card);
    });
}

// ESCENA 4 -> 5 (BATALLA)
btnEscena4.addEventListener("click", () => {
    cambiarEscena("escena-5");
    gestionarBatalla();
});

function gestionarBatalla() {
    if (indiceEnemigoActual >= enemigosActivos.length) {
        finalizarJuego();
        return;
    }

    const enemigo = enemigosActivos[indiceEnemigoActual];
    
    elementosUI.areaCombate.innerHTML = `
        <h3 style="color:gold">VS ${enemigo.nombre}</h3>
        <div class="vs-container">
             <div>Tú: <span id="vida-jugador-combate">${jugador.vida}</span> HP</div>
             <div>Enemigo: ${enemigo.vida} HP</div>
        </div>
        <p>¡Luchando!...</p>
    `;

    combate(enemigo, jugador);

    setTimeout(() => {
        mostrarResultadoCombate(enemigo);
    }, 800);
}

function mostrarResultadoCombate(enemigo) {
    let htmlResultado = "";
    let btnText = "";
    let btnAction = null;

    if (jugador.vida > 0) {
        htmlResultado = `
            <h2 style="color:#76ff03">¡VICTORIA!</h2>
            <p>Has derrotado a ${enemigo.nombre}.</p>
            <p>Puntos Totales: ${jugador.puntos}</p>
            <p>Vida restante: ${jugador.vida}</p>
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
    
    const nuevoBtn = btnEscena5.cloneNode(true);
    btnEscena5.parentNode.replaceChild(nuevoBtn, btnEscena5);
    nuevoBtn.addEventListener("click", btnAction);
}

function finalizarJuego() {
    const rango = distinguirJugador(jugador.puntos, 300);
    elementosUI.puntuacionFinal.textContent = jugador.puntos;
    elementosUI.mensajeRango.innerHTML = `Rango alcanzado: <strong style="color:gold; font-size:1.5em">${rango}</strong>`;
    cambiarEscena("escena-6");
}

btnEscena6.addEventListener("click", () => {
    iniciarJuego();
});

iniciarJuego();