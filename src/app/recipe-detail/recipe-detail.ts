import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Observable, of } from 'rxjs';
import { switchMap, map,catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog/delete-confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-recipe-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss'
})
export class RecipeDetail implements OnInit{
  recipe$: Observable<Recipe | null>;
  isAuthenticated$: Observable<boolean>;
  isOwner$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.recipe$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.recipeService.getRecipeById(id) : of(null);
      })
    );
    this.isOwner$ = this.recipe$.pipe(
      switchMap(recipe => {
        if (!recipe) return of(false);
        return this.authService.getCurrentUser().pipe(
          map(user => user?.uid === recipe.userId)
        );
      })
    );
  }

  ngOnInit(): void {}

  deleteRecipe(recipeId: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.deleteRecipe(recipeId).then(() => {
         this.router.navigate(['/browse-recipes']);
        }).catch(err => {
          console.error('Error deleting recipe:', err);
        });
      }
    });
  }



}
