import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/room-searcher/room-searcher').then(m => m.RoomSearcher),
  },
  {
    path: 'now-playing',
    loadComponent: () => import('./views/room/room').then(m => m.RoomComponent),
  }
];
