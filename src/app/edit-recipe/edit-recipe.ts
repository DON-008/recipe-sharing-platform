import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute,RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './edit-recipe.html',
  styleUrls: ['./edit-recipe.scss']
})
export class EditRecipe implements OnInit {
  recipeForm: FormGroup;
  isAuthenticated$: Observable<boolean>;
  errorMessage = '';
  recipe$: Observable<Recipe | null>;
  recipeId: string | null = null; // Public property for recipe ID
  cuisines = ['Italian', 'Indian', 'Mexican', 'Vegan', 'Dessert'];
  dietaryTags = ['Vegan', 'Gluten-Free', 'Vegetarian', 'Non-Vegetarian'];
  prepTimes = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '60 min' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      cuisine: ['', Validators.required],
      dietaryTags: [[], Validators.required],
      prepTime: [0, Validators.required],
      ingredients: ['', Validators.required],
      instructions: ['', Validators.required]
    });
    this.recipe$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.recipeId = params.get('id'); // Store ID in public property
        return this.recipeId ? this.recipeService.getRecipeById(this.recipeId) : of(null);
      }),
      catchError(err => {
        this.errorMessage = 'Failed to load recipe';
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(['/auth']);
      }
    });
    this.recipe$.subscribe(recipe => {
      if (recipe) {
        this.recipeForm.patchValue({
          title: recipe.title,
          description: recipe.description,
          cuisine: recipe.cuisine,
          dietaryTags: recipe.dietaryTags,
          prepTime: recipe.prepTime,
          ingredients: recipe.ingredients.join('\n'),
          instructions: recipe.instructions.join('\n')
        });
      }
    });
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.errorMessage = 'Recipe ID not found';
        return;
      }
      const recipe = {
        ...this.recipeForm.value,
        ingredients: this.recipeForm.value.ingredients.split('\n').filter((item: string) => item.trim()),
        instructions: this.recipeForm.value.instructions.split('\n').filter((item: string) => item.trim())
      };
      this.recipeService.updateRecipe(id, recipe).then(() => {
        this.router.navigate(['/recipe', id]);
      }).catch(err => {
        this.errorMessage = err.message;
      });
    }
  }
}