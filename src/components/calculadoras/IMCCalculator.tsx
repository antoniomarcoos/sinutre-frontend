import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface IMCCalculatorProps {
  defaultWeight?: string;
  defaultHeight?: string;
}

export function IMCCalculator({ defaultWeight = '', defaultHeight = '' }: IMCCalculatorProps) {
  const [peso, setPeso] = useState(defaultWeight);
  const [altura, setAltura] = useState(defaultHeight);
  const [resultado, setResultado] = useState<{ imc: number; classificacao: string } | null>(null);

  useEffect(() => {
    if (defaultWeight) setPeso(defaultWeight);
    if (defaultHeight) setAltura(defaultHeight);
  }, [defaultWeight, defaultHeight]);

  function calcularIMC() {
    const pesoNum = Number(peso);
    const alturaNum = Number(altura) / 100;

    if (!pesoNum || !alturaNum) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (pesoNum <= 0 || alturaNum <= 0) {
      toast.error('Valores devem ser maiores que zero');
      return;
    }

    const imc = pesoNum / (alturaNum * alturaNum);
    let classificacao = '';

    if (imc < 18.5) classificacao = 'Abaixo do peso';
    else if (imc < 25) classificacao = 'Peso normal';
    else if (imc < 30) classificacao = 'Sobrepeso';
    else if (imc < 35) classificacao = 'Obesidade grau 1';
    else if (imc < 40) classificacao = 'Obesidade grau 2';
    else classificacao = 'Obesidade grau 3';

    setResultado({ imc, classificacao });
  }

  function limpar() {
    setPeso('');
    setAltura('');
    setResultado(null);
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Calculadora de IMC</h3>
      <p className="text-sm text-base-content/60 mb-4">
        Descubra seu Índice de Massa Corporal e entenda o que ele significa para sua saúde.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
        <div className="form-control">
          <label className="label">Peso (kg)</label>
          <input
            type="number"
            className="input input-bordered"
            placeholder="Ex: 70"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            step="0.1"
          />
        </div>

        <div className="form-control">
          <label className="label">Altura (cm)</label>
          <input
            type="number"
            className="input input-bordered"
            placeholder="Ex: 175"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            step="0.1"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={calcularIMC}>
          Calcular
        </button>
        <button className="btn btn-ghost" onClick={limpar}>
          Limpar
        </button>
      </div>

      {resultado && (
        <div className="mt-6 p-4 bg-base-200 rounded-box max-w-md">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Seu IMC:</span>
            <span className="text-2xl font-bold">{resultado.imc.toFixed(1)}</span>
          </div>
          <div className="mt-2">
            <span className="font-semibold">Classificação:</span>
            <span className={`ml-2 badge ${
              resultado.classificacao === 'Peso normal' ? 'badge-success' : 'badge-warning'
            }`}>
              {resultado.classificacao}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}