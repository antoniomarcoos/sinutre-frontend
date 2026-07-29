import type { Icon } from '@phosphor-icons/react';
import {
  BowlFood,
  Coffee,
  Hamburger,
  MoonStars,
} from '@phosphor-icons/react';
import type { MealCategory } from '@/types/meal';

export interface MealCategoryInfo {
  id: MealCategory;
  label: string;
  Icon: Icon;
}

export const MEAL_CATEGORIES: readonly MealCategoryInfo[] = [
  { id: 'breakfast', label: 'Café da Manhã', Icon: Coffee },
  { id: 'snack', label: 'Lanche', Icon: Hamburger },
  { id: 'lunch', label: 'Almoço', Icon: BowlFood },
  { id: 'dinner', label: 'Jantar', Icon: MoonStars },
] as const;

export const MEAL_CATEGORY_BY_ID: Record<MealCategory, MealCategoryInfo> =
  MEAL_CATEGORIES.reduce(
    (acc, category) => {
      acc[category.id] = category;
      return acc;
    },
    {} as Record<MealCategory, MealCategoryInfo>,
  );