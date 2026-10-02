import { computed, Service, signal } from '@angular/core';
import { Actividad } from '../modelos/actividad';

const INICIALES: readonly Actividad[] = [
    { id: 1, titulo: 'Preparar estructura HTML', estado: 'completada', prioridad: 'alta', creadaEn: '2026-08-10', destacada: false },
    { id: 2, titulo: 'Revisar contraste', estado: 'en_progreso', prioridad: 'media', creadaEn: '2026-08-12', destacada: true },
    { id: 3, titulo: 'Practicar TypeScript', estado: 'pendiente', prioridad: 'alta', creadaEn: '2026-08-14', destacada: false },
    { id: 4, titulo: 'Comprobar vista estrecha', estado: 'pendiente', prioridad: 'baja', creadaEn: '2026-08-16', destacada: false },
    { id: 5, titulo: 'Ejecutar el build', estado: 'pendiente', prioridad: 'media', creadaEn: '2026-08-18', destacada: false },
];

@Service()
export class ActividadesService {
    private readonly lista = signal<Actividad[]>(INICIALES.map((a) => ({ ...a })));

    readonly actividades = this.lista.asReadonly();
    readonly total = computed(() => this.lista().length);
}