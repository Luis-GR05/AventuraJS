/**
 * @file Jefe.js
 * @description Extiende la clase Enemigo, añadiendo mayor dificultad mediante un multiplicador de daño. 
 * @module Jefe
 * @author Luis Gordillo Rodriguez
 */

import { Enemigo } from "./Enemigo.js";

export class Jefe extends Enemigo {
    constructor(nombre, avatar, ataque, vida) {
        super(nombre, avatar, ataque, vida);
        this.multiplicador = 1.2;
    }
}
