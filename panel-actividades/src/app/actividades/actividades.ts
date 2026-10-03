import { computed, inject, Service, signal } from '@angular/core';
import { AlmacenamientoService } from '../compartido/almacenamiento';
import { Actividad, EstadoActividad, LIMITES, Prioridad } from '../modelos/actividad';

const CLAVE = 'panel.actividades.v1';

const INICIALES: readonly Actividad[] = [
    { id: 1, descripcion: '', titulo: 'Preparar estructura HTML', estado: 'completada', prioridad: 'alta', creadaEn: '2026-08-10', destacada: false },
    { id: 2, descripcion: '', titulo: 'Revisar contraste', estado: 'en_progreso', prioridad: 'media', creadaEn: '2026-08-12', destacada: true },
    { id: 3, descripcion: '', titulo: 'Practicar TypeScript', estado: 'pendiente', prioridad: 'alta', creadaEn: '2026-08-14', destacada: false },
    { id: 4, descripcion: '', titulo: 'Comprobar vista estrecha', estado: 'pendiente', prioridad: 'baja', creadaEn: '2026-08-16', destacada: false },
    { id: 5, descripcion: '', titulo: 'Ejecutar el build', estado: 'pendiente', prioridad: 'media', creadaEn: '2026-08-18', destacada: false },
];

@Service()
export class ActividadesService {
    private readonly almacen = inject(AlmacenamientoService);

    private readonly lista = signal<Actividad[]>(INICIALES.map((a) => ({ ...a })));

    readonly actividades = this.lista.asReadonly();
    readonly aviso = signal('');
    readonly sinGuardar = signal(false);

    readonly total = computed(() => this.lista().length);

    readonly pendientes = computed(
        () => this.lista().filter((a) => a.estado === 'pendiente').length,
    );

    readonly enProgreso = computed(
        () => this.lista().filter((a) => a.estado === 'en_progreso').length,
    );

    readonly completadas = computed(
        () => this.lista().filter((a) => a.estado === 'completada').length,
    );

    readonly porcentaje = computed(() =>
        this.total() === 0 ? 0 : Math.round((this.completadas() / this.total()) * 100),
    );

    constructor() {
        this.cargar();

        window.addEventListener('storage', (evento) => {
            if (evento.key === CLAVE) {
                this.cargar();
            }
        });
    }

    buscarPorId(id: number): Actividad | undefined {
        return this.lista().find((a) => a.id === id);
    }

    crear(titulo: string, descripcion: string, prioridad: Prioridad): Actividad | null {
        const limpio = titulo.trim();

        if (!this.tituloAceptable(limpio, null)) {
            return null;
        }

        const nueva: Actividad = {
            id: this.siguienteId(),
            titulo: limpio,
            descripcion: descripcion.trim(),
            estado: 'pendiente',
            prioridad,
            creadaEn: new Date().toISOString().slice(0, 10),
            destacada: false,
        };

        this.aplicar((actual) => [...actual, nueva]);
        return nueva;
    }

    actualizar(id: number, titulo: string, descripcion: string, prioridad: Prioridad): boolean {
        const limpio = titulo.trim();

        if (!this.buscarPorId(id) || !this.tituloAceptable(limpio, id)) {
            return false;
        }

        this.aplicar((actual) =>
            actual.map((a) =>
                a.id === id ? { ...a, titulo: limpio, descripcion: descripcion.trim(), prioridad } : a,
            ),
        );

        return true;
    }

    private tituloAceptable(limpio: string, salvo: number | null): boolean {
        if (limpio.length < LIMITES.tituloMin || limpio.length > LIMITES.tituloMax) {
            return false;
        }

        const normal = limpio.toLocaleLowerCase('es');

        return !this.lista().some(
            (a) => a.id !== salvo && a.titulo.toLocaleLowerCase('es') === normal,
        );
    }

    private siguienteId(): number {
        return this.lista().reduce((mayor, a) => Math.max(mayor, a.id), 0) + 1;
    }

    alternarDestacada(id: number): void {
        this.aplicar((actual) =>
            actual.map((a) => (a.id === id ? { ...a, destacada: !a.destacada } : a)),
        );
    }

    avanzarEstado(id: number): void {
        this.aplicar((actual) =>
            actual.map((a) => (a.id === id ? { ...a, estado: this.siguienteEstado(a.estado) } : a)),
        );
    }

    eliminar(id: number): void {
        this.aplicar((actual) => actual.filter((a) => a.id !== id));
    }

    vaciar(): void {
        this.aplicar(() => []);
    }

    private aplicar(cambio: (actual: Actividad[]) => Actividad[]): void {
        this.lista.update(cambio);
        this.guardar();
    }

    private guardar(): void {
        this.sinGuardar.set(!this.almacen.guardar(CLAVE, this.lista()));
    }

    private cargar(): void {
        if (!this.almacen.existe(CLAVE)) {
            return;
        }

        const valor = this.almacen.leer(CLAVE);

        if (!esColeccionActividades(valor)) {
            this.aviso.set('Lo que había guardado no se pudo leer. Empiezas con las actividades de ejemplo.');
            return;
        }

        this.lista.set(valor.map((a) => ({ ...a })));
    }

    private siguienteEstado(estado: EstadoActividad): EstadoActividad {
        if (estado === 'pendiente') return 'en_progreso';
        if (estado === 'en_progreso') return 'completada';
        return 'completada';
    }
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

export function esEstadoActividad(valor: unknown): valor is EstadoActividad {
    return valor === 'pendiente' || valor === 'en_progreso' || valor === 'completada';
}

export function esPrioridad(valor: unknown): valor is Prioridad {
    return valor === 'baja' || valor === 'media' || valor === 'alta';
}

export function esActividad(valor: unknown): valor is Actividad {
    if (!esRegistro(valor)) return false;

    return (
        typeof valor['id'] === 'number' &&
        Number.isInteger(valor['id']) &&
        valor['id'] > 0 &&
        typeof valor['titulo'] === 'string' &&
        valor['titulo'].trim().length > 0 &&
        esEstadoActividad(valor['estado']) &&
        esPrioridad(valor['prioridad']) &&
        typeof valor['creadaEn'] === 'string' &&
        typeof valor['destacada'] === 'boolean' &&
        typeof valor['descripcion'] === 'string'
    );
}

export function esColeccionActividades(valor: unknown): valor is Actividad[] {
    if (!Array.isArray(valor)) return false;

    const vistos = new Set<number>();
    for (const elemento of valor) {
        if (!esActividad(elemento) || vistos.has(elemento.id)) return false;
        vistos.add(elemento.id);
    }

    return true;
}