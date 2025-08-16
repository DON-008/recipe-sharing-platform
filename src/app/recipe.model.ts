export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cuisine: string;
  dietaryTags: string;
  prepTime: number;
  ingredients: string[];
  instructions: string[];
}