import {Producto} from "../clases/Producto.js"
import { RAREZAS, TIPOS } from "../constantes.js"; 

export const listaProductos = [
    new Producto("Peto", "/img/Peto.png", 30, RAREZAS.pocoComun, TIPOS.armadura, 10),
    new Producto("Espada", "/img/Espada.png", 70, RAREZAS.legendario, TIPOS.arma, 25),
    new Producto("Arco", "/img/", 20, RAREZAS.comun, TIPOS.arma, 5),
    new Producto("Escudo", "/img/", 40, RAREZAS.epico, TIPOS.armadura, 20),
    new Producto("Manzana", "/img/", 20, RAREZAS.raro, TIPOS.consumible, 15),
    new Producto("Chuleta", "/img/", 40, RAREZAS.legendario, TIPOS.consumible, 25),
    new Producto("Capa", "/img/", 15, RAREZAS.comun, TIPOS.armadura, 5),
    new Producto("Lanza", "/img/", 35, RAREZAS.raro, TIPOS.arma, 15),
];

export function filtrarProductos(rareza){
    return listaProductos.filter(producto => producto.rareza === rareza)
}

export function aplicarDescuento(criterio, descuento){
    for (Producto in listaProductos) {
        if(Producto.rareza === criterio || Producto.tipo === criterio) {
            Producto.aplicarDescuento(descuento);
        }
    }
}

export function buscarProducto(nombre){
    return listaProductos.find(producto => producto.nombre.toLowerCase().includes(nombre.toLowercase()))
}