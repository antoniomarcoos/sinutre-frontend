import { DotsThree, Eye, Pencil, Trash } from '@phosphor-icons/react';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import type { Meal } from '@/types/mealSummary';
import { formatDate } from '@/utils/date';
import { formatCalories, formatMacro } from '@/utils/format';

interface MealsTableRowProps {
  meal: Meal;
  displayId?: number;
  onView?: (meal: Meal) => void;
  onEdit?: (meal: Meal) => void;
  onDelete?: (meal: Meal) => void;
}

export function MealsTableRow({ 
  meal, 
  displayId,
  onView, 
  onEdit, 
  onDelete 
}: MealsTableRowProps) {
  const category = MEAL_CATEGORY_BY_ID[meal.type];
  const categoryLabel = category?.label || meal.type || 'Outra';

  return (
    <tr className="hover">
      <td className="text-center font-bold text-base-content/60">{displayId ?? meal.id}</td>
      <td className="font-medium">{meal.name}</td>
      <td className="font-medium">{formatDate(meal.eatTime)}</td>
      <td className="font-semibold">{categoryLabel}</td>
      <td>
        <span className="badge badge-primary badge-outline">
          {formatCalories(meal.totals.calories)} kcal
        </span>
      </td>
      <td className="text-center">
        <div className="dropdown dropdown-end">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-sm btn-ghost btn-square"
            aria-label="Mais ações"
          >
            <DotsThree size={20} />
          </button>
          
          <ul 
            tabIndex={0} 
            className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-44 z-[50]"
          >
            <li>
              <button
                type="button"
                onClick={() => onView?.(meal)}
                className="flex items-center gap-2"
              >
                <Eye size={16} /> Ver detalhes
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onEdit?.(meal)}
                className="flex items-center gap-2"
              >
                <Pencil size={16} /> Editar
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onDelete?.(meal)}
                className="flex items-center gap-2 text-error"
              >
                <Trash size={16} /> Excluir
              </button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
}