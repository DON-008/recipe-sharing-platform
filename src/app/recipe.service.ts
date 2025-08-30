import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Firestore, collection, query, where, collectionData, doc, getDoc, addDoc, updateDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Recipe } from './recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getRecipes(filters: { search?: string; cuisine?: string; dietary?: string; prepTime?: number }): Observable<Recipe[]> {
    const recipesCollection = collection(this.firestore, 'recipes');
    let q = query(recipesCollection);

    console.log('Filters:', filters); // Debug log

    // Apply server-side filters (excluding search)
    if (filters.cuisine) {
      q = query(q, where('cuisine', '==', filters.cuisine));
    }
    if (filters.dietary) {
      q = query(q, where('dietaryTags', 'array-contains', filters.dietary));
    }
    if (filters.prepTime && filters.prepTime > 0) {
      q = query(q, where('prepTime', '<=', filters.prepTime));
    }

    return collectionData(q, { idField: 'id' }).pipe(
      map(recipes => {
        let filteredRecipes = recipes as Recipe[];
        if (filters.search) {
          const searchTerm = filters.search.trim().toLowerCase();
          console.log('Search term:', searchTerm);
          filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.cuisine.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.title.toLowerCase().includes(searchTerm)
          );
        }
        console.log('Recipes fetched:', filteredRecipes);
        return filteredRecipes;
      })
    );
  }

  getRecipeById(id: string): Observable<Recipe | null> {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return new Observable<Recipe | null>(observer => {
      getDoc(recipeDoc).then(snapshot => {
        if (snapshot.exists()) {
          observer.next({ id: snapshot.id, ...snapshot.data() } as Recipe);
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }

  async addRecipe(recipe: Omit<Recipe, 'id'>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to add a recipe');
    }
    const recipesCollection = collection(this.firestore, 'recipes');
    await addDoc(recipesCollection, { ...recipe, userId: user.uid });
  }

  async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to update a recipe');
    }
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    const snapshot = await getDoc(recipeDoc);
    if (!snapshot.exists()) {
      throw new Error('Recipe not found');
    }
    if (snapshot.data()['userId'] !== user.uid) {
      throw new Error('User not authorized to update this recipe');
    }
    await updateDoc(recipeDoc, recipe);
  }

  

  
  // loadMore(batchSize: number): Observable<void> {
  //   return of();
  // }
}


