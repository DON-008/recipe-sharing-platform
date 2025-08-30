import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SeedComponent } from './seed.component';
import { AuthComponent } from './auth/auth';
import { CreateRecipeComponent } from './create-recipe/create-recipe';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const routes: Routes = [
    {
        path:'',
        component:Home
    },
    { 
    path: 'browse-recipes', 
    loadComponent: () => import('./browse-recipes/browse-recipes').then(m => m.BrowseRecipes)
    },
    { 
    path: 'recipe/:id', 
    loadComponent: () => import('./recipe-detail/recipe-detail').then(m => m.RecipeDetail)
    },
    {
    path: 'create-recipe',
    loadComponent: () => import('./create-recipe/create-recipe').then(m => m.CreateRecipeComponent),
    canActivate: [() => inject(AuthService).isAuthenticated().pipe(map(isAuthenticated => isAuthenticated ? true : '/auth'))]
    },
    { path: 'auth', component: AuthComponent },
    { path: 'seed', component: SeedComponent },
    { 
    path: '**', redirectTo: '' 
    }
];
