import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'monuments',
    loadComponent: () => import('./pages/monuments/monuments').then((m) => m.Monuments),
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map-page').then((m) => m.MapPage),
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'm/:slug',
    loadComponent: () => import('./pages/monument-detail/monument-detail').then((m) => m.MonumentDetail),
  },
  { path: '**', redirectTo: '' },
];
