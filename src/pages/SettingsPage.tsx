import { useState, useEffect } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Sun, Moon, User, Download } from '@phosphor-icons/react';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const response = await api.get('/user/goals');
      setCaloriesGoal(response.data.caloriesGoal || 2000);
      setWaterGoal(response.data.waterGoal || 2000);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  }

  async function handleSave() {
    try {
      setLoading(true);
      await api.put('/user/goals', { caloriesGoal, waterGoal });
      toast.success('Metas atualizadas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar metas');
    } finally {
      setLoading(false);
    }
  }

  async function exportMeals() {
    try {
      setExporting(true);
      const response = await api.get('/export/meals', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'refeicoes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Refeições exportadas com sucesso');
    } catch (error) {
      toast.error('Erro ao exportar refeições');
    } finally {
      setExporting(false);
    }
  }

  async function exportWater() {
    try {
      setExporting(true);
      const response = await api.get('/export/water', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'agua.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Água exportada com sucesso');
    } catch (error) {
      toast.error('Erro ao exportar água');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader title="Configurações" subtitle="Gerencie suas preferências" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Metas diárias</h3>

          <div className="form-control mb-4">
            <label className="label">Calorias diárias</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={caloriesGoal}
              onChange={(e) => setCaloriesGoal(Number(e.target.value))}
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">Água (ml)</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={waterGoal}
              onChange={(e) => setWaterGoal(Number(e.target.value))}
            />
          </div>

          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? 'Salvando...' : 'Salvar metas'}
          </button>
        </div>

        <div className="card bg-base-100 shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Preferências</h3>

          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun size={24} className="text-yellow-500" />
              ) : (
                <Moon size={24} className="text-blue-400" />
              )}
              <span className="font-medium">Tema {theme === 'light' ? 'Claro' : 'Escuro'}</span>
            </div>
            <button onClick={toggleTheme} className="btn btn-sm btn-outline">
              {theme === 'light' ? '🌙 Ativar escuro' : '☀️ Ativar claro'}
            </button>
          </div>

          <button
            className="btn btn-outline w-full mb-2"
            onClick={() => setProfileModalOpen(true)}
          >
            <User size={20} className="mr-2" />
            Editar Perfil
          </button>
        </div>

        <div className="card bg-base-100 shadow-sm p-6 lg:col-span-2">
          <h3 className="font-semibold text-lg mb-4">Exportar dados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              className="btn btn-outline w-full"
              onClick={exportMeals}
              disabled={exporting}
            >
              <Download size={20} className="mr-2" />
              {exporting ? 'Exportando...' : 'Exportar refeições (CSV)'}
            </button>
            <button
              className="btn btn-outline w-full"
              onClick={exportWater}
              disabled={exporting}
            >
              <Download size={20} className="mr-2" />
              {exporting ? 'Exportando...' : 'Exportar água (CSV)'}
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onUpdated={loadGoals}
      />
    </div>
  );
}