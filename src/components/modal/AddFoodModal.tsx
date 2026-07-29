import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { createFood, searchFoods } from '@/services/foodService';
import type { Food } from '@/types/food';

interface AddFoodModalProps {
  modalId: string;
  onCreated: () => Promise<void> | void;
}

export function AddFoodModal({
  modalId,
  onCreated,
}: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Food[]>([]);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await searchFoods(query);
        setSuggestions(result);
        setShowSuggestions(result.length > 0);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelectSuggestion(food: Food) {
    setName(food.name);
    setCaloriesPer100g(String(food.caloriesPer100g));
    setCarbsPer100g(String(food.carbsPer100g));
    setProteinPer100g(String(food.proteinPer100g));
    setFatPer100g(String(food.fatPer100g));
    setSuggestions([]);
    setShowSuggestions(false);
    setQuery(food.name);
    inputRef.current?.focus();
  }

  function handleNameChange(value: string) {
    setQuery(value);
    setName(value);
    if (value.length < 2) {
      setShowSuggestions(false);
    }
  }

  function handleBlur(e: React.FocusEvent) {
    if (listRef.current && listRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }

  function handleFocus() {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Digite o nome do alimento');
      return;
    }

    try {
      setLoading(true);

      await createFood({
        name: name.trim(),
        caloriesPer100g: Number(caloriesPer100g) || 0,
        carbsPer100g: Number(carbsPer100g) || 0,
        proteinPer100g: Number(proteinPer100g) || 0,
        fatPer100g: Number(fatPer100g) || 0,
      });

      toast.success('Alimento adicionado com sucesso');

      setName('');
      setCaloriesPer100g('');
      setCarbsPer100g('');
      setProteinPer100g('');
      setFatPer100g('');
      setQuery('');
      setShowSuggestions(false);

      await onCreated();

      (
        document.getElementById(
          modalId,
        ) as HTMLDialogElement
      )?.close();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Este alimento já está na sua lista');
      } else {
        toast.error('Erro ao salvar alimento');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Novo alimento
        </h3>

        <div className="space-y-3 mt-4">
          <div className="relative">
            <input
              ref={inputRef}
              className="input input-bordered w-full"
              placeholder="Nome"
              value={query || name}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul
                ref={listRef}
                className="absolute z-50 bg-base-100 border rounded-box shadow w-full mt-1 max-h-40 overflow-auto"
                onMouseDown={(e) => e.preventDefault()}
              >
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

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Calorias por 100g"
            value={caloriesPer100g}
            onChange={(e) => setCaloriesPer100g(e.target.value)}
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Carboidratos por 100g"
            value={carbsPer100g}
            onChange={(e) => setCarbsPer100g(e.target.value)}
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Proteínas por 100g"
            value={proteinPer100g}
            onChange={(e) => setProteinPer100g(e.target.value)}
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Gorduras por 100g"
            value={fatPer100g}
            onChange={(e) => setFatPer100g(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">
              Cancelar
            </button>
          </form>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </dialog>
  );
}