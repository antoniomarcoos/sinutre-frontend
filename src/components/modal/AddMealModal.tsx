import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { FoodItem } from '@/types/meal';
import { MealItemForm } from './MealItemForm';
import { MealItemsTable } from './MealItemsTable';
import { MealMacrosSummary } from './MealMacrosSummary';
import { MealMetadataForm } from './MealMetadataForm';
import { MealCategory } from '@/types/meal';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import { createMeal, updateMeal } from '@/services/mealService';
import { MealState } from '@/types/meal';
import type { Meal } from '@/types/mealSummary';

interface AddMealModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  typeMeal: MealCategory | null;
  onMealCreated: () => Promise<void>;
  editingMeal?: Meal;
}

export function AddMealModal({
  open,
  typeMeal,
  onClose,
  onMealCreated,
  editingMeal
}: AddMealModalProps) {
  if(!typeMeal && !editingMeal){
    return <></>
  }

  const categoryId = editingMeal?.type || typeMeal;
  const category = MEAL_CATEGORY_BY_ID[categoryId as MealCategory];
  
  const [meal, setMeal] = useState<MealState>({
    description: editingMeal?.name || '',
    type: category?.id || typeMeal,
    eatTime: editingMeal?.eatTime ? new Date(editingMeal.eatTime).toISOString().slice(0, 16) : '',
  });

  const [items, setItems] = useState<FoodItem[]>(() => {
    if (editingMeal?.items) {
      return editingMeal.items.map((item) => ({
        id: item.id || Date.now(),
        foodId: item.foodId,
        name: item.food?.name || '',
        grams: item.grams || 0,
        calories: item.food ? (item.food.caloriesPer100g * item.grams) / 100 : 0,
        carbs: item.food ? (item.food.carbsPer100g * item.grams) / 100 : 0,
        protein: item.food ? (item.food.proteinPer100g * item.grams) / 100 : 0,
        fat: item.food ? (item.food.fatPer100g * item.grams) / 100 : 0,
      }));
    }
    return [];
  });

  useEffect(() => {
    if (editingMeal) {
      setMeal({
        description: editingMeal.name || '',
        type: editingMeal.type || typeMeal,
        eatTime: editingMeal.eatTime ? new Date(editingMeal.eatTime).toISOString().slice(0, 16) : '',
      });
      if (editingMeal.items) {
        setItems(editingMeal.items.map((item) => ({
          id: item.id || Date.now(),
          foodId: item.foodId,
          name: item.food?.name || '',
          grams: item.grams || 0,
          calories: item.food ? (item.food.caloriesPer100g * item.grams) / 100 : 0,
          carbs: item.food ? (item.food.carbsPer100g * item.grams) / 100 : 0,
          protein: item.food ? (item.food.proteinPer100g * item.grams) / 100 : 0,
          fat: item.food ? (item.food.fatPer100g * item.grams) / 100 : 0,
        })));
      }
    }
  }, [editingMeal]);

  function handleAddItem(item: FoodItem) {
    setItems((current) => [...current, item]);
  }

  function handleRemoveItem(item: FoodItem) {
    setItems((current) => current.filter((x) => x.id !== item.id));
  }

  async function handleSaveMeal() {
    if (!meal.eatTime) {
      toast.error('Selecione uma data e horário');
      return;
    }

    if (items.length === 0) {
      toast.error('Adicione pelo menos um item à refeição');
      return;
    }

    const data = {
      ...meal,
      items: items.map((item) => ({
        foodId: item.foodId,
        grams: item.grams,
      })),
    };

    try {
      if (editingMeal) {
        await updateMeal(String(editingMeal.id), data);
      } else {
        await createMeal(data);
      }

      toast.success('Refeição salva com sucesso!');
      await onMealCreated();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Data inválida. Selecione uma data e horário válidos.');
      } else {
        toast.error('Erro ao salvar refeição');
      }
    }
  }

  const macros = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.carbs += item.carbs;
          acc.proteins += item.protein;
          acc.fats += item.fat;
          acc.calories += item.calories;
          return acc;
        },
        {
          carbs: 0,
          proteins: 0,
          fats: 0,
          calories: 0,
          caloriesGoal: 0,
        },
      ),
    [items],
  );

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`} role="dialog">
      <div className="modal-box max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">
          {editingMeal ? 'Editar Refeição' : 'Adicionar Refeição'}
        </h2>
        
        <MealMacrosSummary macros={macros} />
        <MealMetadataForm meal={meal} setMeal={setMeal} />

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4">Itens da Refeição</h3>
          <MealItemForm onAdd={handleAddItem} />
        </div>

        <MealItemsTable items={items} onRemove={handleRemoveItem} />

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveMeal}>
            {editingMeal ? 'Atualizar' : 'Salvar refeição'}
          </button>
        </div>
      </div>
    </div>
  );
}