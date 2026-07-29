import type { Meal } from '@/types/mealSummary';
import { MealListItem } from './MealListItem';

interface MealsListProps {
  meals: Meal[];
  onActionClick?: (meal: Meal) => void;
  onView?: (meal: Meal) => void;
  onEdit?: (meal: Meal) => void;
  onDelete?: (meal: Meal) => void;
}

export function MealsList({ meals, onActionClick, onView, onEdit, onDelete }: MealsListProps) {
  return (
    <section className="flex flex-col gap-3 lg:hidden">
      {meals.map(meal => (
        <MealListItem
          key={meal.id}
          meal={meal}
          onActionClick={onActionClick}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}