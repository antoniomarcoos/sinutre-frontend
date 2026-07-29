import { useState } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { IMCCalculator } from '@/components/calculadoras/IMCCalculator';
import { GastoCaloricoCalculator } from '@/components/calculadoras/GastoCaloricoCalculator';
import { CalculadoraNutricional } from '@/components/calculadoras/CalculadoraNutricional';

export function CalculadorasPage() {
  const [activeTab, setActiveTab] = useState('imc');

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
        {activeTab === 'imc' && <IMCCalculator />}
        {activeTab === 'gasto' && <GastoCaloricoCalculator />}
        {activeTab === 'nutricional' && <CalculadoraNutricional />}
      </div>
    </div>
  );
}