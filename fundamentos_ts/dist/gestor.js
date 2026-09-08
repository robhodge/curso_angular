export class GestorActividades {
    actividades;
    constructor(actividades) {
        this.actividades = actividades;
    }
    buscarPorId(id) {
        return this.actividades.find((actividad) => actividad.id === id);
    }
    completar(id) {
        return this.actividades.map((actividad) => actividad.id === id
            ? { ...actividad, estado: 'completada' }
            : actividad);
    }
}
