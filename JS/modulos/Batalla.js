/**
 * @file Batalla.js
 * @description Lógica del combate por turnos entre el jugador y los enemigos. Controla daño, defensa, turnos y puntos obtenidos. 
 * @module Batalla
 * @author Luis Gordillo Rodriguez
 */

import { Jefe } from "../clases/Jefe.js";
import { MAX_TURNOS } from "../constantes.js";

export function combate(enemigo, jugador) {
    let turno = 1;

    while (enemigo.vida > 0 && jugador.vida > 0 && turno <= MAX_TURNOS) {
        let defensaJugador = jugador.defensaTotal();
        let ataqueJugador = jugador.ataqueTotal();
        let ataqueEnemigoReal = enemigo.ataque;

        if (enemigo instanceof Jefe) {
            ataqueEnemigoReal = Math.floor(enemigo.ataque * enemigo.multiplicador);
        }
        /**Al menos 1 de daño*/
        let danioAlJugador = Math.max(1, ataqueEnemigoReal - defensaJugador);
        jugador.vida -= danioAlJugador;

        if (jugador.vida > 0) {
            enemigo.vida -= ataqueJugador;
        }
        turno++;
    }

    if (enemigo.vida <= 0) {
        if (enemigo instanceof Jefe) {
            jugador.puntos += 100 * enemigo.multiplicador;
        } else {
            jugador.puntos += 100 + enemigo.ataque;
        }
    }
}
