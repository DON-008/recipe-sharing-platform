import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss'
})
export class RecipeDetail implements OnInit{
  recipe$: Observable<Recipe | null>;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {
    this.recipe$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.recipeService.getRecipeById(id) : of(null);
      })
    );
  }

  ngOnInit(): void {}

}
