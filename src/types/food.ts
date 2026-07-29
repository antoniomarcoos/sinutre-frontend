export interface Food {
  id: number;
  name: string;
  caloriesPer100g: number;
  carbsPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  isFavorite?: boolean;
}