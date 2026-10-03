import { Routes } from '@angular/router';
import { DetalleActividad } from './actividades/detalle-actividad/detalle-actividad';
import { SeccionActividades } from './actividades/seccion-actividades/seccion-actividades';
import { PaginaNoEncontrada } from './compartido/pagina-no-encontrada/pagina-no-encontrada';
import { PaginaActividades } from './actividades/pagina-actividades/pagina-actividades/pagina-actividades';
import { puedeSalir } from './actividades/puede-salir';

export const routes: Routes = [
    { path: '', redirectTo: 'actividades', pathMatch: 'full' },

    {
        path: 'actividades',
        component: SeccionActividades,
        children: [
            { path: '', component: PaginaActividades, title: 'Actividades' },
            {
                path: 'nueva',
                title: 'Nueva actividad',
                canDeactivate: [puedeSalir],
                loadComponent: () =>
                    import('./actividades/formulario-actividad/formulario-actividad').then(
                        (m) => m.FormularioActividad,
                    ),
            },
            { path: ':id', component: DetalleActividad, title: 'Detalle de la actividad' },
            {
                path: ':id/editar',
                title: 'Editar actividad',
                canDeactivate: [puedeSalir],
                loadComponent: () =>
                    import('./actividades/formulario-actividad/formulario-actividad').then(
                        (m) => m.FormularioActividad,
                    ),
            },
        ],
    },
    {
        path: 'estadisticas',
        title: 'Estadísticas',
        loadComponent: () =>
            import('./estadisticas/pagina-estadisticas/pagina-estadisticas/pagina-estadisticas').then(
                (m) => m.PaginaEstadisticas,
            ),
    },

    { path: '**', component: PaginaNoEncontrada, title: 'Página no encontrada' },
];