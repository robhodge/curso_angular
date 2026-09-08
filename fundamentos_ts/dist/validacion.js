const estados = ['pendiente', 'en_progreso', 'completada'];
const prioridades = ['baja', 'media', 'alta'];
export function esActividad(valor) {
    if (typeof valor !== 'object' || valor === null) {
        return false;
    }
    const candidato = valor;
    return (typeof candidato['id'] === 'number' &&
        typeof candidato['titulo'] === 'string' &&
        typeof candidato['estado'] === 'string' &&
        estados.includes(candidato['estado']) &&
        typeof candidato['prioridad'] === 'string' &&
        prioridades.includes(candidato['prioridad']));
}
export function leerActividadesJson(texto) {
    const valor = JSON.parse(texto);
    if (!Array.isArray(valor) || !valor.every(esActividad)) {
        throw new Error('El JSON no contiene una lista válida de actividades.');
    }
    return valor;
}
