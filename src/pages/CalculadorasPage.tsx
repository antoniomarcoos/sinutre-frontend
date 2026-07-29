import { useState, useEffect } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { IMCCalculator } from '@/components/calculadoras/IMCCalculator';
import { GastoCaloricoCalculator } from '@/components/calculadoras/GastoCaloricoCalculator';
import { CalculadoraNutricional } from '@/components/calculadoras/CalculadoraNutricional';
import { api } from '@/lib/api';

export function CalculadorasPage() {
  const [activeTab, setActiveTab] = useState('imc');
  const [profile, setProfile] = useState({ weight: '', height: '', age: '', imc: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  function calcularIdade(birthDate: string) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return String(age);
  }

  function calcularIMC(weight: number, height: number) {
    if (!weight || !height) return '';
    const alturaMetros = height / 100;
    const imc = weight / (alturaMetros * alturaMetros);
    return imc.toFixed(1);
  }

  async function loadProfile() {
    try {
      const response = await api.get('/user/profile');
      let age = '';
      if (response.data.birthDate) {
        age = calcularIdade(response.data.birthDate);
      }
      const weight = response.data.weight || 0;
      const height = response.data.height || 0;
      const imc = calcularIMC(weight, height);

      setProfile({
        weight: weight ? String(weight) : '',
        height: height ? String(height) : '',
        age: age,
        imc: imc,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Calculadoras"
        subtitle="Ferramentas de saúde e nutrição"
      />

      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === 'imc' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('imc')}
        >
          IMC
        </button>
        <button
          className={`tab ${activeTab === 'gasto' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('gasto')}
        >
          Gasto Calórico
        </button>
        <button
          className={`tab ${activeTab === 'nutricional' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('nutricional')}
        >
          Calculadora Nutricional
        </button>
      </div>

      <div className="card bg-base-100 shadow-sm p-6">
        {activeTab === 'imc' && <IMCCalculator defaultWeight={profile.weight} defaultHeight={profile.height} />}
        {activeTab === 'gasto' && <GastoCaloricoCalculator defaultWeight={profile.weight} defaultHeight={profile.height} defaultAge={profile.age} />}
        {activeTab === 'nutricional' && <CalculadoraNutricional defaultWeight={profile.weight} defaultHeight={profile.height} defaultImc={profile.imc} />}
      </div>
    </div>
  );
}