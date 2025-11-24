export class Producto {
    constructor(nombre, imagen, precio, rareza, tipo, bonus){
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    formatearAtributos(atributo){
        let atributoAct;
        if(atributo.toLowerCase() == "precio") {
            atributoAct = this.precio;
            atributoAct = atributoAct / 100;
            atributoAct += "€";
        }
        this.precio = atributoAct;
    }

    aplicarDescuento(valor){
        this.precio = this.precio - valor;
    }
}