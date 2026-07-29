import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getFoods } from '@/services/foodService';
import type { Food } from '@/types/food';
import { formatMacro } from '@/utils/format';

interface ItemSelecionado {
  id: string;
  foodId: number;
  name: string;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export function CalculadoraNutricional() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [grams, setGrams] = useState('100');
  const [items, setItems] = useState<ItemSelecionado[]>([]);

  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await getFoods(search);
        setSuggestions(result);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleSelectSuggestion(food: Food) {
    setSelectedFood(food);
    setSearch(food.name);
    setSuggestions([]);
    setGrams('100');
  }

  function handleAddItem() {
    if (!selectedFood) {
      toast.error('Selecione um alimento');
      return;
    }

    const gramsNum = Number(grams);
    if (!gramsNum || gramsNum <= 0) {
      toast.error('Digite uma quantidade válida');
      return;
    }

    const item: ItemSelecionado = {
      id: Date.now().toString(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      grams: gramsNum,
      calories: (selectedFood.caloriesPer100g * gramsNum) / 100,
      carbs: (selectedFood.carbsPer100g * gramsNum) / 100,
      protein: (selectedFood.proteinPer100g * gramsNum) / 100,
      fat: (selectedFood.fatPer100g * gramsNum) / 100,
    };

    setItems([...items, item]);
    setSelectedFood(null);
    setSearch('');
    setGrams('100');
  }

  function handleRemoveItem(id: string) {
    setItems(items.filter(item => item.id !== id));
  }

  const totals = items.reduce(
    (acc, item) => {
      acc.grams += item.grams;
      acc.calories += item.calories;
      acc.carbs += item.carbs;
      acc.protein += item.protein;
      acc.fat += item.fat;
      return acc;
    },
    { grams: 0, calories: 0, carbs: 0, protein: 0, fat: 0 }
  );

  function limpar() {
    setItems([]);
    setSelectedFood(null);
    setSearch('');
    setGrams('100');
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Calculadora Nutricional</h3>
      <p className="text-sm text-base-content/60 mb-4">
        Monte seu prato e analise macronutrientes com a base de dados TACO.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
        <div className="relative md:col-span-2">
          <label className="label">Alimento</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Digite o nome do alimento"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-50 bg-base-100 border rounded-box shadow w-full mt-1 max-h-40 overflow-auto">
              {suggestions.map((food) => (
                <li
                  key={food.id}
                  className="px-4 py-2 hover:bg-base-200 cursor-pointer text-sm"
                  onClick={() => handleSelectSuggestion(food)}
                >
                  {food.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="label">Quantidade (g)</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="input input-bordered w-full"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              step="1"
            />
            <button
              className="btn btn-primary"
              onClick={handleAddItem}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="table table-zebra table-sm">
            <thead>
              <tr>
                <th>Alimento</th>
                <th>Quantidade</th>
                <th>Calorias</th>
                <th>Carbs</th>
                <th>Proteínas</th>
                <th>Gordura</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.grams}g</td>
                  <td>{Math.round(item.calories)} kcal</td>
                  <td>{formatMacro(item.carbs)}g</td>
                  <td>{formatMacro(item.protein)}g</td>
                  <td>{formatMacro(item.fat)}g</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold bg-base-200">
              <tr>
                <td>Total</td>
                <td>{formatMacro(totals.grams)}g</td>
                <td>{Math.round(totals.calories)} kcal</td>
                <td>{formatMacro(totals.carbs)}g</td>
                <td>{formatMacro(totals.protein)}g</td>
                <td>{formatMacro(totals.fat)}g</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="flex gap-2 mt-4">
            <button className="btn btn-ghost btn-sm" onClick={limpar}>
              Limpar tudo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}