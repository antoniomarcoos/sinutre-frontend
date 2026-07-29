import { useState } from 'react';
import toast from 'react-hot-toast';

export function GastoCaloricoCalculator() {
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [sexo, setSexo] = useState('masculino');
  const [atividade, setAtividade] = useState('1.2');
  const [resultado, setResultado] = useState<{ tmb: number; tdee: number } | null>(null);

  const fatoresAtividade = [
    { label: 'Sedentário', value: '1.2' },
    { label: 'Levemente ativo', value: '1.375' },
    { label: 'Moderadamente ativo', value: '1.55' },
    { label: 'Muito ativo', value: '1.725' },
    { label: 'Extremamente ativo', value: '1.9' },
  ];

  function calcular() {
    const idadeNum = Number(idade);
    const pesoNum = Number(peso);
    const alturaNum = Number(altura);
    const fator = Number(atividade);

    if (!idadeNum || !pesoNum || !alturaNum) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (idadeNum <= 0 || pesoNum <= 0 || alturaNum <= 0) {
      toast.error('Valores devem ser maiores que zero');
      return;
    }

    let tmb = 0;
    if (sexo === 'masculino') {
      tmb = 10 * pesoNum + 6.25 * alturaNum - 5 * idadeNum + 5;
    } else {
      tmb = 10 * pesoNum + 6.25 * alturaNum - 5 * idadeNum - 161;
    }

    const tdee = tmb * fator;

    setResultado({ tmb, tdee });
  }

  function limpar() {
    setIdade('');
    setPeso('');
    setAltura('');
    setSexo('masculino');
    setAtividade('1.2');
    setResultado(null);
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Gasto Calórico</h3>
      <p className="text-sm text-base-content/60 mb-4">
        Calcule seu gasto energético diário baseado no seu perfil e nível de atividade física.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
        <div className="form-control">
          <label className="label">Idade (anos)</label>
          <input
            type="number"
            className="input input-bordered"
            placeholder="Ex: 30"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
        </div>

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
          />
        </div>

        <div className="form-control">
          <label className="label">Sexo</label>
          <select
            className="select select-bordered"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>

        <div className="form-control md:col-span-2">
          <label className="label">Nível de atividade</label>
          <select
            className="select select-bordered"
            value={atividade}
            onChange={(e) => setAtividade(e.target.value)}
          >
            {fatoresAtividade.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={calcular}>
          Calcular
        </button>
        <button className="btn btn-ghost" onClick={limpar}>
          Limpar
        </button>
      </div>

      {resultado && (
        <div className="mt-6 p-4 bg-base-200 rounded-box max-w-md">
          <div className="flex justify-between items-center">
            <span className="font-semibold">TMB:</span>
            <span className="text-xl font-bold">{Math.round(resultado.tmb)} kcal</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold">Gasto diário (TDEE):</span>
            <span className="text-xl font-bold text-primary">{Math.round(resultado.tdee)} kcal</span>
          </div>
          <p className="text-xs text-base-content/60 mt-2">
            TMB = Taxa metabólica basal | TDEE = Gasto energético total diário
          </p>
        </div>
      )}
    </div>
  );
}