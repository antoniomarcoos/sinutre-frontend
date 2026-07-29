import type { FoodItem } from '@/types/meal';
import { formatMacro } from '@/utils/format';

interface MealItemsTableProps {
  items: FoodItem[];
  onRemove?: (item: FoodItem) => void;
}

export function MealItemsTable({ items, onRemove }: MealItemsTableProps) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Quantidade</th>
            <th>Calorias</th>
            <th>Carboidratos</th>
            <th>Proteínas</th>
            <th>Gordura</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.grams} g</td>
              <td>
                <span className="badge badge-outline badge-primary">
                  {formatMacro(item.calories)} kcal
                </span>
              </td>
              <td>{formatMacro(item.carbs)} g</td>
              <td>{formatMacro(item.protein)} g</td>
              <td>{formatMacro(item.fat)} g</td>
              <td>
                <button
                  type="button"
                  onClick={() => onRemove?.(item)}
                  className="btn btn-ghost btn-xs"
                >
                  remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}