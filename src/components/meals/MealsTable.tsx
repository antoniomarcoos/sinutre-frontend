import type { Meal } from "@/types/mealSummary";
import { MealsTableRow } from './MealsTableRow';

interface MealsTableProps {
  meals: Meal[];
  onView?: (meal: Meal) => void;
  onEdit?: (meal: Meal) => void;
  onDelete?: (meal: Meal) => void;
}

export function MealsTable({ meals, onView, onEdit, onDelete }: MealsTableProps) {
  
  return (
    <section className="card bg-base-100 shadow-sm w-full hidden lg:block">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-base-content">
          <thead className="bg-base-200/70 text-base-content/60 uppercase text-xs">
            <tr>
              <th className="w-16 text-center">ID</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Categoria</th>
              <th>Total de Calorias</th>
              <th className="text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, index) => (
              <MealsTableRow
                key={meal.id}
                meal={meal}
                displayId={meals.length - index}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}