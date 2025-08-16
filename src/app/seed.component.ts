import { Component } from '@angular/core';
import { Firestore, collection, writeBatch, doc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cuisine: string;
  dietaryTags: string[];
  prepTime: number;
  ingredients: string[];
  instructions: string[];
}

@Component({
  selector: 'app-seed',
  standalone: true,
  imports: [CommonModule],
  template: `<button (click)="seedRecipes()">Seed Recipes</button><p>{{message}}</p>`
})
export class SeedComponent {
  message = '';

  private sampleRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta with creamy egg sauce and pancetta.',
      imageUrl: '/assets/placeholder.jpg',
      cuisine: 'Italian',
      dietaryTags: ['Non-Vegetarian'],
      prepTime: 30,
      ingredients: ['200g spaghetti', '2 eggs', '100g pancetta', '50g parmesan', '2 cloves garlic'],
      instructions: ['Boil pasta until al dente.', 'Fry pancetta until crispy.', 'Mix eggs with parmesan.', 'Combine all with pasta.']
    },
    {
      id: '2',
      title: 'Vegan Buddha Bowl',
      description: 'Healthy mix of quinoa, avocado, and roasted veggies.',
      imageUrl: '/assets/placeholder.jpg',
      cuisine: 'Vegan',
      dietaryTags: ['Vegan', 'Gluten-Free'],
      prepTime: 40,
      ingredients: ['1 cup quinoa', '1 avocado', '200g sweet potatoes', '100g kale', '1 tbsp olive oil'],
      instructions: ['Cook quinoa.', 'Roast sweet potatoes.', 'Sauté kale.', 'Assemble bowl with avocado.']
    },
    {
      id: '3',
      title: 'Chicken Tikka Masala',
      description: 'Spicy and creamy Indian curry with tender chicken.',
      imageUrl: '/assets/placeholder.jpg',
      cuisine: 'Indian',
      dietaryTags: ['Non-Vegetarian'],
      prepTime: 60,
      ingredients: ['500g chicken', '200g yogurt', '2 tbsp tikka masala paste', '1 onion', '400g tomatoes'],
      instructions: ['Marinate chicken in yogurt and spices.', 'Grill chicken.', 'Cook onion and tomatoes.', 'Simmer with chicken.']
    },
    {
      id: '4',
      title: 'Chocolate Lava Cake',
      description: 'Decadent dessert with a gooey molten center.',
      imageUrl: '/assets/placeholder.jpg',
      cuisine: 'Dessert',
      dietaryTags: ['Vegetarian'],
      prepTime: 25,
      ingredients: ['100g dark chocolate', '100g butter', '2 eggs', '50g sugar', '30g flour'],
      instructions: ['Melt chocolate and butter.', 'Mix eggs and sugar.', 'Combine with flour.', 'Bake at 200°C for 10 min.']
    },
    {
      id: '5',
      title: 'Mexican Tacos',
      description: 'Flavorful tacos with seasoned beef and fresh toppings.',
      imageUrl: '/assets/placeholder.jpg',
      cuisine: 'Mexican',
      dietaryTags: ['Non-Vegetarian'],
      prepTime: 35,
      ingredients: ['300g ground beef', '8 taco shells', '1 tomato', '1 avocado', '100g cheese'],
      instructions: ['Cook beef with spices.', 'Prepare toppings.', 'Assemble tacos.']
    }
  ];

  constructor(private firestore: Firestore) {}

  async seedRecipes() {
    this.message = 'Seeding recipes...';
    const batch = writeBatch(this.firestore);
    const recipesCollection = collection(this.firestore, 'recipes');

    this.sampleRecipes.forEach((recipe) => {
      const docRef = doc(recipesCollection, recipe.id);
      batch.set(docRef, recipe);
    });

    try {
      await batch.commit();
      this.message = 'Successfully added recipes to Firestore';
    } catch (error) {
      this.message = `Error adding recipes: ${error}`;
    }
  }
}