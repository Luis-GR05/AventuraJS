/**
 * @file utils.js
 * @description Funciones utilitarias comunes: aleatorios y cambio de escena visual en la UI del juego. 
 * @author Luis Gordillo Rodriguez
 */

export function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function cambiarEscena(idEscenaMostrar) {
    const escenas = document.querySelectorAll('.escena');
    escenas.forEach(e => e.style.display = 'none');
    document.getElementById(idEscenaMostrar).style.display = 'block';
}
