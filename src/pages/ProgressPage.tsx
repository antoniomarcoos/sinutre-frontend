import { useState, useEffect } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { api } from '@/lib/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DailyStat {
  date: string;
  calories: number;
  meals: number;
  water: number;
}

interface WeightLog {
  id: number;
  weight: number;
  height: number;
  createdAt: string;
}

export function ProgressPage() {
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState('7');

  async function loadStats() {
    try {
      setLoading(true);
      const response = await api.get('/stats', {
        params: { days },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadWeightHistory() {
    try {
      const response = await api.get('/stats/weight', {
        params: { days },
      });
      setWeightHistory(response.data);
    } catch (error) {
      console.error('Erro ao carregar peso:', error);
    }
  }

  useEffect(() => {
    loadStats();
    loadWeightHistory();
  }, [days]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }

  const totalCalories = stats.reduce((acc, s) => acc + s.calories, 0);
  const totalMeals = stats.reduce((acc, s) => acc + s.meals, 0);
  const totalWater = stats.reduce((acc, s) => acc + s.water, 0);
  const daysWithData = stats.filter(s => s.meals > 0 || s.calories > 0).length;

  const chartData = stats.map(s => ({
    ...s,
    date: formatDate(s.date),
  }));

  const weightData = weightHistory.map(w => ({
    date: formatDate(new Date(w.createdAt).toISOString().split('T')[0]),
    peso: w.weight,
  }));

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader title="Progresso" subtitle="Acompanhe sua evolução" />

      <div className="flex items-center gap-4 mb-6 mt-2">
        <div className="form-control">
          <label className="label">Período</label>
          <select
            className="select select-bordered select-sm"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="14">Últimos 14 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-100 shadow-sm p-4 text-center">
          <span className="text-2xl font-bold text-primary">{totalMeals}</span>
          <span className="text-sm text-base-content/60">Refeições</span>
        </div>
        <div className="card bg-base-100 shadow-sm p-4 text-center">
          <span className="text-2xl font-bold text-primary">{daysWithData}</span>
          <span className="text-sm text-base-content/60">Dias com registro</span>
        </div>
        <div className="card bg-base-100 shadow-sm p-4 text-center">
          <span className="text-2xl font-bold text-primary">
            {stats.length > 0 ? Math.round(totalCalories / stats.length) : 0}
          </span>
          <span className="text-sm text-base-content/60">Média calórica</span>
        </div>
        <div className="card bg-base-100 shadow-sm p-4 text-center">
          <span className="text-2xl font-bold text-primary">{totalWater}</span>
          <span className="text-sm text-base-content/60">Água total (ml)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card bg-base-100 shadow-sm p-4">
          <h4 className="font-semibold mb-2">Calorias por dia</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Math.round(Number(value))} kcal`, 'Calorias']} />
              <Bar dataKey="calories" fill="#10b981" name="Calorias" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-base-100 shadow-sm p-4">
          <h4 className="font-semibold mb-2">Água consumida (ml)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Math.round(Number(value))} ml`, 'Água']} />
              <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} name="Água" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {weightData.length > 0 && (
          <div className="card bg-base-100 shadow-sm p-4">
            <h4 className="font-semibold mb-2">Evolução do peso (kg)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} kg`, 'Peso']} />
                <Line type="monotone" dataKey="peso" stroke="#8b5cf6" strokeWidth={2} name="Peso" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="card bg-base-100 shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Refeições</th>
                  <th>Calorias</th>
                  <th>Água (ml)</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.date}>
                    <td>{formatDate(stat.date)}</td>
                    <td>{stat.meals}</td>
                    <td>{Math.round(stat.calories)}</td>
                    <td>{stat.water}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}