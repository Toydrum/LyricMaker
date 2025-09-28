import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{
		path: 'home',
		loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
		title: 'Home'
	},
	{
		path: 'settings',
		loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes)
	},
	{
		path: '**',
		loadComponent: () => import('./shared/pages/not-found/not-found.component').then(m => m.NotFoundComponent),
		title: 'Not Found'
	}
];
