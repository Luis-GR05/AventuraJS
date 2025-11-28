/**
 * @file constantes.js
 * @description Contiene las constantes globales del juego: vida, puntuación, rarezas y tipos de ítems.
 * @author Luis Gordillo Rodriguez
 */
export const VIDA_MAXIMA = 150;
export const VIDA_INICIAL = 100;
export const PUNTUACION_BASE = 100;
export const MAX_TURNOS = 100;
export const UMBRAL = 500;

export const RAREZAS = {
    comun: "comun", 
    pocoComun: "poco comun", 
    raro: "raro", 
    epico: "epico", 
    legendario: "legendario"
};

export const TIPOS = {
    arma: "arma", 
    armadura: "armadura",
    consumible: "consumible"
};
