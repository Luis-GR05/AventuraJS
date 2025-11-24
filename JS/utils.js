export function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function cambiarEscena(idEscenaMostrar) {
    const escenas = document.querySelectorAll('.escena');
    escenas.forEach(e => e.style.display = 'none');
    document.getElementById(idEscenaMostrar).style.display = 'block';
}