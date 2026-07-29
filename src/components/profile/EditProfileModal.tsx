import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditProfileModal({ isOpen, onClose, onUpdated }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  async function loadProfile() {
    try {
      const response = await api.get('/user/profile');
      setName(response.data.name || '');
      setBirthDate(response.data.birthDate ? response.data.birthDate.split('T')[0] : '');
      setWeight(response.data.weight ? String(response.data.weight) : '');
      setHeight(response.data.height ? String(response.data.height) : '');
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  async function handleSave() {
    try {
      setLoading(true);
      await api.put('/user/profile', {
        name,
        birthDate: birthDate || undefined,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
      });
      toast.success('Perfil atualizado com sucesso');
      onUpdated();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Editar Perfil</h3>

        <div className="space-y-3 mt-4">
          <div className="form-control">
            <label className="label">Nome</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">Data de nascimento</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">Peso (kg)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
              />
            </div>

            <div className="form-control">
              <label className="label">Altura (cm)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" disabled={loading} onClick={handleSave}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}