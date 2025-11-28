/**
 * @file Ranking.js
 * @description Asigna el rango del jugador según la puntuación obtenida tras las batallas. 
 * @module Ranking
 * @author Luis Gordillo Rodriguez
 */
import { UMBRAL } from "../constantes.js";

export function distinguirJugador(puntuacion) {
    let resultado;
    if (puntuacion > UMBRAL) {
        resultado = "Veterano";
    } else {
        resultado = "Novato";
    }
    return resultado;
}
