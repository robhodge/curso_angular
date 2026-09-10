
export type EstadoActividad = 'pendiente' | 'en_progreso' | 'completada';

export type Prioridad = 'baja' | 'media' | 'alta';

export interface Actividad {
    id: number;
    titulo: string;
    estado: EstadoActividad;
    prioridad: Prioridad;
    creadaEn: string; // Fecha en formato ISO (YYYY-MM-DD)
}

export interface ResumenActividades {
    total: number;
    pendientes: number;
    enProgreso: number;
    completadas: number;
    titulosPrioridadAlta: string[];
}