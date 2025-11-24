import {VIDA_MAXIMA, PUNTUACION_BASE, VIDA_INICIAL} from "../constantes.js"

export class Jugador {
    constructor(nombre, avatar){
        this.nombre = nombre;
        this.avatar = avatar;
        this.puntos = PUNTUACION_BASE;
        this.inventario = [];
        this.vida = VIDA_INICIAL;
        this.vidaMaxima = VIDA_MAXIMA;
    }

    agregarInventario(objeto){
        let {...objeto1} = objeto;
        this.inventario.push(objeto1);
    }

    sumarPuntos(puntos){
        this.puntos += puntos;
    }

    ataqueTotal(){
        return this.calcularTotal("arma");
    }

    defensaTotal(){
        return this.calcularTotal("armadura");
    }

    vidaTotal(){
        return this.calcularTotal("consumible");
    }

    calcularTotal(tipo) {
        let total = 0;
        this.inventario.forEach(objeto => {
            if(objeto.tipo.toLowerCase() == tipo){
                total += objeto.bonus;
            }
        });
        return total;
    }
}