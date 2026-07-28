import { Meal } from "@/types/mealSummary";
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import { formatDate } from '@/utils/date';

interface ViewMealModalProps {
  meal: Meal;
  onClose: () => void;
}

export function ViewMealModal({ meal, onClose }: ViewMealModalProps) {
  const category = MEAL_CATEGORY_BY_ID[meal.type];

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Detalhes da Refeição</h3>
        
        <div className="py-4 space-y-3">
          <div className="flex justify-between border-b border-base-300 pb-2">
            <span className="text-base-content/60">Nome</span>
            <span className="font-medium">{meal.name}</span>
          </div>
          
          <div className="flex justify-between border-b border-base-300 pb-2">
            <span className="text-base-content/60">Categoria</span>
            <span className="badge badge-ghost">{category.label}</span>
          </div>
          
          <div className="flex justify-between border-b border-base-300 pb-2">
            <span className="text-base-content/60">Data/Hora</span>
            <span>{formatDate(meal.eatTime)}</span>
          </div>
          
          <div className="flex justify-between border-b border-base-300 pb-2">
            <span className="text-base-content/60">Calorias</span>
            <span className="font-semibold">{meal.totals.calories} kcal</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="text-center p-2 bg-base-200 rounded">
              <div className="text-xs text-base-content/60">Carboidratos</div>
              <div className="font-semibold">{meal.totals.carbs}g</div>
            </div>
            <div className="text-center p-2 bg-base-200 rounded">
              <div className="text-xs text-base-content/60">Proteínas</div>
              <div className="font-semibold">{meal.totals.proteins}g</div>
            </div>
            <div className="text-center p-2 bg-base-200 rounded">
              <div className="text-xs text-base-content/60">Gorduras</div>
              <div className="font-semibold">{meal.totals.fats}g</div>
            </div>
          </div>
        </div>
        
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}