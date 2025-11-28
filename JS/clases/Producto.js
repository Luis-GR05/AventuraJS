/**
 * @file Producto.js
 * @description Clase que representa un objeto comprable en el mercado, con precio, rareza, tipo y bonus para el jugador. 
 * @module Producto
 * @author Luis Gordillo Rodriguez
 */

export class Producto {
    constructor(nombre, imagen, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    formatearAtributos(atributo) {
        let atributoAct;
        if (atributo.toLowerCase() == "precio") {
            atributoAct = this.precio;
            atributoAct = atributoAct / 100;
            atributoAct += "€";
        }
        this.precio = atributoAct;
    }

    aplicarDescuento(valor) {
        this.precio = this.precio - valor;
    }
}
