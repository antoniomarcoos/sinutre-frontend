import { useState } from 'react';
import { MEAL_CATEGORIES } from '@/constants/mealCategories';

interface MealFiltersProps {
  onFilter: (filters: { startDate: string; endDate: string; type: string }) => void;
  onClear: () => void;
}

export function MealFilters({ onFilter, onClear }: MealFiltersProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('todos');

  function handleApply() {
    onFilter({ startDate, endDate, type });
  }

  function handleClear() {
    setStartDate('');
    setEndDate('');
    setType('todos');
    onClear();
  }

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-base-100 rounded-box shadow-sm">
      <div className="form-control">
        <label className="label">Data inicial</label>
        <input
          type="date"
          className="input input-bordered input-sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">Data final</label>
        <input
          type="date"
          className="input input-bordered input-sm"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">Categoria</label>
        <select
          className="select select-bordered select-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="todos">Todas</option>
          {MEAL_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-primary btn-sm" onClick={handleApply}>
          Filtrar
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleClear}>
          Limpar
        </button>
      </div>
    </div>
  );
}