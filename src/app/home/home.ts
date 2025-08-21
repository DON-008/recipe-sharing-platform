import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  searchTerm$ = new BehaviorSubject<string>('');

  recipes$: Observable<Recipe[]>;

  constructor(private recipeService: RecipeService) {
    // this.recipes$ = this.recipeService.getRecipes({  }).pipe(
    //   map(recipes => recipes.slice(0, 4)))
      this.recipes$ = combineLatest([this.searchTerm$.pipe(debounceTime(300))]).pipe(
      switchMap(([search]) => 
        this.recipeService.getRecipes({ search})
      ),
      map(recipes => recipes.slice(0, 4))
    );
    
  }

  onSearchChange(search: string) {
    this.searchTerm$.next(search);
  }

}
