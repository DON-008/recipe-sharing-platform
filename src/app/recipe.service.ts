import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, query, where, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Recipe } from './recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private firestore: Firestore) {}

  getRecipes(filters: { search?: string; cuisine?: string; dietary?: string; prepTime?: number }): Observable<Recipe[]> {
    const recipesCollection = collection(this.firestore, 'recipes');
    let q = query(recipesCollection);

    if (filters.search) {
      q = query(recipesCollection, where('title', '>=', filters.search.trim()), where('title', '<=', filters.search.trim() + '\uf8ff'));
    }
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
      map(recipes => recipes as Recipe[])
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

  

  
  // loadMore(batchSize: number): Observable<void> {
  //   return of();
  // }
}


