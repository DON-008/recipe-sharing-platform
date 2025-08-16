import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSpinner } from '@angular/material/progress-spinner';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-browse-recipes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ScrollingModule,
    MatSpinner,
    RouterModule
  ],
  templateUrl: './browse-recipes.html',
  styleUrl: './browse-recipes.scss'
})
export class BrowseRecipes {
  searchTerm$ = new BehaviorSubject<string>('');
  cuisineFilter$ = new BehaviorSubject<string>('all');
  dietaryFilter$ = new BehaviorSubject<string>('all');
  prepTimeFilter$ = new BehaviorSubject<number>(0);
  loadMore$ = new Subject<void>();

  recipes$: Observable<Recipe[]>;
  batchSize = 20;
  isLoading = false;

  cuisines = ['all', 'Italian', 'Indian', 'Mexican', 'Vegan'];
  dietaryTags = ['all', 'Vegan', 'Gluten-Free', 'Vegetarian'];
  prepTimes = [{ value: 0, label: 'All' }, { value: 30, label: 'Under 30 min' }, { value: 60, label: 'Under 60 min' }];

  constructor(private recipeService: RecipeService) {
    this.recipes$ = combineLatest([this.searchTerm$.pipe(debounceTime(300)), this.cuisineFilter$, this.dietaryFilter$, this.prepTimeFilter$]).pipe(
      switchMap(([search, cuisine, dietary, prepTime]) => 
        this.recipeService.getRecipes({ search, cuisine: cuisine !== 'all' ? cuisine : '', dietary: dietary !== 'all' ? dietary : '', prepTime })
      ),
      map(recipes => recipes.slice(0, this.batchSize))
    );
  }

  ngOnInit(): void {}

  onSearchChange(search: string) {
    this.searchTerm$.next(search);
  }

  onCuisineChange(cuisine: string) {
    this.cuisineFilter$.next(cuisine);
  }

  onDietaryChange(dietary: string) {
    this.dietaryFilter$.next(dietary);
  }

  onPrepTimeChange(prepTime: number) {
    this.prepTimeFilter$.next(prepTime);
  }

  onScroll() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.loadMore$.next();
  }

}
