import { useState } from 'react';
import toast from 'react-hot-toast';
import { sugerirRefeicao } from '@/services/ia.service';
import { api } from '@/lib/api';
import { MEAL_CATEGORIES } from '@/constants/mealCategories';

interface Sugestao {
  nome: string;
  alimentos: { nome: string; quantidade: number; unidade: string }[];
  dicas: string[];
}

interface RefeicaoSugestaoProps {
  onSaved?: () => void;
}

export function RefeicaoSugestao({ onSaved }: RefeicaoSugestaoProps) {
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [sugestao, setSugestao] = useState<Sugestao | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [categoria, setCategoria] = useState('lunch');

  async function handleSugerir() {
    if (!descricao.trim()) {
      toast.error('Descreva o que você quer comer');
      return;
    }

    try {
      setLoading(true);
      const result = await sugerirRefeicao(descricao);
      if (result) {
        setSugestao(result);
        toast.success('Sugestão gerada com sucesso!');
      } else {
        toast.error('Erro ao gerar sugestão');
      }
    } catch (error) {
      toast.error('Erro ao gerar sugestão');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarRefeicao() {
    if (!sugestao) return;

    try {
      setSalvando(true);

      const alimentos = sugestao.alimentos.map((a) => ({
        nome: a.nome,
        quantidade: a.quantidade,
        unidade: a.unidade,
      }));

      await api.post('/meals/suggest', {
        nome: sugestao.nome,
        alimentos: alimentos,
        categoria: categoria,
      });

      toast.success('Refeição salva com sucesso!');
      onSaved?.();
      setSugestao(null);
      setDescricao('');
    } catch (error) {
      toast.error('Erro ao salvar refeição');
      console.error(error);
    } finally {
      setSalvando(false);
    }
  }

  function limpar() {
    setDescricao('');
    setSugestao(null);
  }

  return (
    <div className="card bg-base-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-lg">Sugestão de Refeições com IA</h3>
        <span className="badge badge-primary badge-sm">Beta</span>
      </div>
      <p className="text-sm text-base-content/60 mb-2">
        Descreva o que você quer comer e a IA vai sugerir uma refeição completa.
      </p>
      <div className="alert alert-warning alert-sm mb-4 text-xs">
        Esta é uma sugestão gerada por IA. Consulte sempre um nutricionista.
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Ex: quero uma refeição leve para o café da manhã"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSugerir()}
        />
        <button
          className="btn btn-primary"
          onClick={handleSugerir}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Gerando...
            </>
          ) : (
            'Sugerir'
          )}
        </button>
        <button className="btn btn-ghost" onClick={limpar}>
          Limpar
        </button>
      </div>

      {sugestao && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-lg text-primary">{sugestao.nome}</h4>
          </div>

          <div className="mt-3">
            <h5 className="font-semibold text-sm">Alimentos</h5>
            <ul className="list-disc list-inside mt-1">
              {sugestao.alimentos.map((alimento, index) => (
                <li key={index}>
                  {alimento.nome} - {alimento.quantidade}{alimento.unidade}
                </li>
              ))}
            </ul>
          </div>

          {sugestao.dicas && sugestao.dicas.length > 0 && (
            <div className="mt-3">
              <h5 className="font-semibold text-sm">Dicas</h5>
              <ul className="list-disc list-inside mt-1 text-sm text-base-content/70">
                {sugestao.dicas.map((dica, index) => (
                  <li key={index}>{dica}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <select
              className="select select-bordered select-sm"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {MEAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            <button
              className="btn btn-sm btn-success"
              onClick={handleSalvarRefeicao}
              disabled={salvando}
            >
              {salvando ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Salvando...
                </>
              ) : (
                'Salvar refeição'
              )}
            </button>
          </div>

          <div className="mt-3 text-xs text-base-content/40 border-t border-base-300 pt-2">
            Sugestão gerada por IA. Consulte um nutricionista.
          </div>
        </div>
      )}
    </div>
  );
}