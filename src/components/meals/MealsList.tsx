import type { Meal } from '@/types/mealSummary';
import { MealListItem } from './MealListItem';

interface MealsListProps {
  meals: Meal[];
  onView?: (meal: Meal) => void;
  onEdit?: (meal: Meal) => void;
  onDelete?: (meal: Meal) => void;
}

export function MealsList({ meals, onView, onEdit, onDelete }: MealsListProps) {
  return (
    <section className="flex flex-col gap-3 lg:hidden">
      {meals.map(meal => (
        <MealListItem
          key={meal.id}
          meal={meal}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}