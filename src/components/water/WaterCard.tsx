import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export function WaterCard() {
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useState(2000);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState('');

  async function loadWater() {
    try {
      const response = await api.get('/water');
      setTotal(response.data.total);
      
      const goals = await api.get('/user/goals');
      setGoal(goals.data.waterGoal || 2000);
    } catch (error) {
      console.error('Erro ao carregar água:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addWater(amount: number) {
    try {
      await api.post('/water', { amount });
      toast.success(`${amount}ml adicionado`);
      loadWater();
    } catch (error) {
      toast.error('Erro ao adicionar água');
    }
  }

  useEffect(() => {
    loadWater();
  }, []);

  const progress = Math.min((total / goal) * 100, 100);

  return (
    <div className="card bg-base-100 shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">💧 Água</h3>
        <span className="text-sm text-base-content/60">
          {total}ml / {goal}ml
        </span>
      </div>

      <div className="w-full bg-base-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          className="btn btn-xs btn-outline btn-primary"
          onClick={() => addWater(200)}
        >
          +200ml
        </button>
        <button
          className="btn btn-xs btn-outline btn-primary"
          onClick={() => addWater(300)}
        >
          +300ml
        </button>
        <button
          className="btn btn-xs btn-outline btn-primary"
          onClick={() => addWater(500)}
        >
          +500ml
        </button>

        <div className="flex gap-1">
          <input
            type="number"
            className="input input-bordered input-xs w-20"
            placeholder="ml"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <button
            className="btn btn-xs btn-outline btn-primary"
            onClick={() => {
              const amount = Number(customAmount);
              if (amount > 0) {
                addWater(amount);
                setCustomAmount('');
              }
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}