import { Enemigo } from "./Enemigo.js";

export class Jefe extends Enemigo {
    constructor(nombre, avatar, ataque, vida){
        super(nombre,avatar,ataque,vida)
        this.multiplicador = 1.2;
    }
}