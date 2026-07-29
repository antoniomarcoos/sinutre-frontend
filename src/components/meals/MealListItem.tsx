import { DotsThreeVertical } from '@phosphor-icons/react';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import type { Meal } from '@/types/mealSummary';
import { formatDate } from '@/utils/date';
import { formatCalories } from '@/utils/format';

interface MealListItemProps {
  meal: Meal;
  onActionClick?: (meal: Meal) => void;
}

export function MealListItem({ meal, onActionClick }: MealListItemProps) {
  const category = MEAL_CATEGORY_BY_ID[meal.type];
  const Icon = category?.Icon || (() => null);
  const categoryLabel = category?.label || meal.type || 'Outra';

  return (
    <article className="card card-side bg-base-100 shadow-sm">
      <div className="card-body p-4 flex-row items-center gap-4">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{categoryLabel}</p>
          <p className="font-semibold text-sm">{meal.name}</p>
          <p className="text-xs text-base-content/50">{formatDate(meal.eatTime)}</p>
        </div>
        <span className="badge badge-primary badge-outline badge-sm">
          {formatCalories(meal.totals.calories)} kcal
        </span>
        <button
          type="button"
          onClick={() => onActionClick?.(meal)}
          className="btn btn-ghost btn-sm btn-square"
          aria-label="Mais ações"
        >
          <DotsThreeVertical size={18} />
        </button>
      </div>
    </article>
  );
}