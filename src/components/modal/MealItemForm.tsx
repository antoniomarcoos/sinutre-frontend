import { useState, useEffect } from 'react';
import { FormField } from '../forms/FormField';
import { FoodItem } from '@/types/meal';
import { Food } from '@/types/food';
import { getFoods } from '@/services/foodService';

interface MealItemFormProps {
  onAdd: (item: FoodItem) => void;
}

export function MealItemForm({ onAdd }: MealItemFormProps) {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [grams, setGrams] = useState('');

  function handleAdd() {
    if (!selectedFood) {
      return;
    }

    const gramsValue = Number(grams);

    if (gramsValue <= 0) {
      return;
    }

    onAdd({
      id: Date.now(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      grams: gramsValue,
      calories: (selectedFood.caloriesPer100g * gramsValue) / 100,
      carbs: (selectedFood.carbsPer100g * gramsValue) / 100,
      protein: (selectedFood.proteinPer100g * gramsValue) / 100,
      fat: (selectedFood.fatPer100g * gramsValue) / 100,
    });

    setSelectedFood(null);
    setQuery('');
    setGrams('');
  }

  useEffect(() => {
    if (query.length < 2) {
      setFoods([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await getFoods(query);
        setFoods(result);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="grid gap-4 items-end lg:[grid-template-columns:1fr_150px_120px]">
      <div className="relative">
        <FormField label="Alimento" htmlFor="item-name">
          <input
            id="item-name"
            type="text"
            value={selectedFood?.name ?? query}
            placeholder="Digite um alimento"
            className="input input-bordered w-full"
            onChange={(e) => {
              setSelectedFood(null);
              setQuery(e.target.value);
            }}
          />
        </FormField>

        {!selectedFood && foods.length > 0 && (
          <ul className="absolute z-50 bg-base-100 border rounded-box shadow w-full mt-1 max-h-60 overflow-auto">
            {foods.map((food) => (
              <li
                key={food.id}
                className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() => {
                  setSelectedFood(food);
                  setQuery(food.name);
                  setFoods([]);
                }}
              >
                {food.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <FormField label="Gramas" htmlFor="item-grams">
        <input
          id="item-grams"
          type="number"
          className="input input-bordered w-full"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
        />
      </FormField>

      <button
        type="button"
        className="btn btn-primary btn-outline h-12"
        onClick={handleAdd}
      >
        Adicionar
      </button>
    </div>
  );
}