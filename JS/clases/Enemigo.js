/**
 * @file Enemigo.js
 * @description Clase base que representa a un enemigo estándar del juego. Contiene vida, ataque y avatar. 
 * @module Enemigo
 * @author Luis Gordillo Rodriguez
 */

export class Enemigo {
    constructor(nombre, avatar, ataque, vida) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.ataque = ataque;
        this.vida = vida;
    }
}
