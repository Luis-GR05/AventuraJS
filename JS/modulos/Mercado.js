/**
 * @file Mercado.js
 * @description Control del mercado: lista de productos, filtros, búsqueda y descuentos aplicables a ítems. 
 * @module Mercado
 * @author Luis Gordillo Rodriguez
 */

import { Producto } from "../clases/Producto.js";
import { RAREZAS, TIPOS } from "../constantes.js"; 

export const listaProductos = [
    new Producto("Peto", "./img/Items/Peto.png", 30, RAREZAS.pocoComun, TIPOS.armadura, 10),
    new Producto("Espada", "./img/Items/Espada.png", 70, RAREZAS.legendario, TIPOS.arma, 25),
    new Producto("Arco", "./img/Items/Arco.png", 20, RAREZAS.comun, TIPOS.arma, 5),
    new Producto("Escudo", "./img/Items/Escudo.png", 40, RAREZAS.epico, TIPOS.armadura, 20),
    new Producto("Manzana", "./img/Items/Manzana.png", 20, RAREZAS.raro, TIPOS.consumible, 15),
    new Producto("Chuleta", "./img/Items/Chuleta.png", 40, RAREZAS.legendario, TIPOS.consumible, 25),
    new Producto("Capa", "./img/Items/Capa.png", 15, RAREZAS.comun, TIPOS.armadura, 5),
    new Producto("Lanza", "./img/Items/Lanza.png", 35, RAREZAS.raro, TIPOS.arma, 15),
];

export function filtrarProductos(rareza) {
    return listaProductos.filter(producto => producto.rareza === rareza);
}

export function aplicarDescuento(criterio, descuento) {
    for (Producto in listaProductos) {
        if (Producto.rareza === criterio || Producto.tipo === criterio) {
            Producto.aplicarDescuento(descuento);
        }
    }
}

export function buscarProducto(nombre) {
    return listaProductos.find(producto => producto.nombre.toLowerCase().includes(nombre.toLowercase()));
}
