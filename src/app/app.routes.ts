import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SeedComponent } from './seed.component';

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
    { path: 'seed', component: SeedComponent },
    { 
    path: '**', redirectTo: '' 
    }
];
