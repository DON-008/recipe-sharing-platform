import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RecipeService } from '../recipe.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-recipe',
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
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './create-recipe.html',
  styleUrls: ['./create-recipe.scss']
})
export class CreateRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  isAuthenticated$: Observable<boolean>;
  errorMessage = '';
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
    private router: Router
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
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(['/auth']);
      }
    });
  }

  addListItem(controlName: string, input: HTMLInputElement) {
    if (input.value.trim()) {
      const control = this.recipeForm.get(controlName);
      const currentItems = control?.value || [];
      control?.setValue([...currentItems, input.value.trim()]);
      input.value = '';
    }
  }

  removeListItem(controlName: string, index: number) {
    const control = this.recipeForm.get(controlName);
    const currentItems = control?.value || [];
    control?.setValue(currentItems.filter((_: any, i: number) => i !== index));
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      const recipe = {
        ...this.recipeForm.value,
        imageUrl: '/assets/placeholder.jpg', // Default image
        ingredients: this.recipeForm.value.ingredients.split('\n').filter((item: string) => item.trim()),
        instructions: this.recipeForm.value.instructions.split('\n').filter((item: string) => item.trim())
      };
      this.recipeService.addRecipe(recipe).then(() => {
        this.router.navigate(['/browse-recipes']);
      }).catch(err => {
        this.errorMessage = err.message;
      });
    }
  }
}