export function distinguirJugador(puntuacion, umbral = 500) {
    let resultado;
    if(puntuacion > umbral) {
        resultado = "Veterano";
    } else {
        resultado = "Novato";
    }
    return resultado;
}