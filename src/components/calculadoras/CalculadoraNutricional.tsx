import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getAllFoods } from '@/services/foodService';
import type { Food } from '@/types/food';
import { formatMacro } from '@/utils/format';

interface ItemSelecionado {
  id: string;
  foodId: number;
  name: string;
  category?: string;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface Metas {
  calorias: number;
  proteinas: number;
  carbos: number;
  gorduras: number;
}

interface CalculadoraNutricionalProps {
  defaultWeight?: string;
  defaultHeight?: string;
}

export function CalculadoraNutricional({ defaultWeight = '', defaultHeight = '' }: CalculadoraNutricionalProps) {
  const [profile, setProfile] = useState('adulto');
  const [peso, setPeso] = useState(defaultWeight);
  const [altura, setAltura] = useState(defaultHeight);
  const [imc, setImc] = useState('');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Food[]>([]);
  const [items, setItems] = useState<ItemSelecionado[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (defaultWeight) setPeso(defaultWeight);
    if (defaultHeight) setAltura(defaultHeight);
  }, [defaultWeight, defaultHeight]);

  useEffect(() => {
    const pesoNum = Number(peso);
    const alturaNum = Number(altura);
    if (pesoNum > 0 && alturaNum > 0) {
      const alturaMetros = alturaNum / 100;
      const imcCalculado = pesoNum / (alturaMetros * alturaMetros);
      setImc(imcCalculado.toFixed(1));
    } else {
      setImc('');
    }
  }, [peso, altura]);

  const profiles = [
    { id: 'adulto', label: 'Adulto' },
    { id: 'atleta', label: 'Atleta' },
    { id: 'idoso', label: 'Idoso' },
    { id: 'crianca', label: 'Criança' },
  ];

  function calcularMetas(): Metas {
    const pesoNum = Number(peso) || 70;
    const alturaNum = Number(altura) || 175;

    switch (profile) {
      case 'atleta':
        return {
          calorias: Math.round(pesoNum * 35),
          proteinas: Math.round(pesoNum * 2.2),
          carbos: Math.round(pesoNum * 5),
          gorduras: Math.round(pesoNum * 1.2),
        };
      case 'idoso':
        return {
          calorias: Math.round(pesoNum * 25),
          proteinas: Math.round(pesoNum * 1.2),
          carbos: Math.round(pesoNum * 3),
          gorduras: Math.round(pesoNum * 0.8),
        };
      case 'crianca':
        return {
          calorias: Math.round(pesoNum * 30),
          proteinas: Math.round(pesoNum * 1.0),
          carbos: Math.round(pesoNum * 4),
          gorduras: Math.round(pesoNum * 0.8),
        };
      default:
        return {
          calorias: Math.round(pesoNum * 28),
          proteinas: Math.round(pesoNum * 1.6),
          carbos: Math.round(pesoNum * 4),
          gorduras: Math.round(pesoNum * 1.0),
        };
    }
  }

  const metas = calcularMetas();

  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await getAllFoods(search);
        setSuggestions(result);
        setShowSuggestions(result.length > 0);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleSelectSuggestion(food: Food) {
    const grams = 100;
    const item: ItemSelecionado = {
      id: Date.now().toString(),
      foodId: food.id,
      name: food.name,
      category: 'Alimento',
      grams,
      calories: (food.caloriesPer100g * grams) / 100,
      carbs: (food.carbsPer100g * grams) / 100,
      protein: (food.proteinPer100g * grams) / 100,
      fat: (food.fatPer100g * grams) / 100,
    };
    setItems([...items, item]);
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    toast.success(`${food.name} adicionado`);
  }

  function handleRemoveItem(id: string) {
    setItems(items.filter(item => item.id !== id));
  }

  function handleUpdateGrams(id: string, newGrams: number) {
    if (newGrams <= 0) return;
    setItems(items.map(item => {
      if (item.id === id) {
        const factor = newGrams / item.grams;
        return {
          ...item,
          grams: newGrams,
          calories: item.calories * factor,
          carbs: item.carbs * factor,
          protein: item.protein * factor,
          fat: item.fat * factor,
        };
      }
      return item;
    }));
  }

  const totals = items.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.carbs += item.carbs;
      acc.protein += item.protein;
      acc.fat += item.fat;
      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0 }
  );

  function limpar() {
    setItems([]);
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function getProfileLabel() {
    const p = profiles.find(p => p.id === profile);
    return p ? p.label : 'Adulto';
  }

  async function exportarPDF() {
    if (items.length === 0) {
      toast.error('Adicione alimentos ao prato primeiro');
      return;
    }

    try {
      const content = document.createElement('div');
      content.style.padding = '40px 30px 40px 30px';
      content.style.backgroundColor = '#ffffff';
      content.style.color = '#000000';
      content.style.fontFamily = 'Arial, sans-serif';
      content.style.maxWidth = '700px';
      content.style.margin = '0 auto';
      content.style.borderRadius = '12px';
      content.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      content.style.width = '100%';
      content.style.boxSizing = 'border-box';
      content.style.overflow = 'visible';

      let itemsHtml = '';
      items.forEach((item, index) => {
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        itemsHtml += `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background-color:${bgColor};border-bottom:1px solid #e5e7eb;">
            <div>
              <span style="font-weight:600;font-size:14px;">${item.name}</span>
              <span style="color:#6b7280;font-size:12px;margin-left:12px;">${item.grams}g</span>
            </div>
            <div style="display:flex;align-items:center;gap:16px;">
              <span style="font-weight:600;color:#10b981;font-size:14px;">${Math.round(item.calories)} kcal</span>
              <span style="font-size:12px;color:#6b7280;">
                P: ${formatMacro(item.protein)}g | C: ${formatMacro(item.carbs)}g | G: ${formatMacro(item.fat)}g
              </span>
            </div>
          </div>
        `;
      });

      content.innerHTML = `
        <div style="border-bottom:3px solid #10b981;padding-bottom:16px;margin-bottom:20px;">
          <h1 style="font-size:24px;font-weight:700;color:#10b981;margin:0;">SiNutre</h1>
          <p style="font-size:14px;color:#6b7280;margin:4px 0 0 0;">Relatório Nutricional - Calculadora de Pratos</p>
        </div>

        <div style="margin-bottom:20px;">
          <h2 style="font-size:18px;font-weight:600;color:#1f2937;margin:0 0 12px 0;">Resumo do Prato</h2>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
            <div style="background-color:#f0fdf4;padding:12px;border-radius:8px;text-align:center;">
              <div style="font-size:20px;font-weight:700;color:#10b981;line-height:30px;padding-bottom:8px;overflow:visible;display:block;">${Math.round(totals.calories)}</div>
              <div style="font-size:11px;color:#6b7280;">Calorias</div>
            </div>
            <div style="background-color:#eff6ff;padding:12px;border-radius:8px;text-align:center;">
              <div style="font-size:20px;font-weight:700;color:#3b82f6;line-height:30px;padding-bottom:8px;overflow:visible;display:block;">${formatMacro(totals.protein)}g</div>
              <div style="font-size:11px;color:#6b7280;">Proteínas</div>
            </div>
            <div style="background-color:#fefce8;padding:12px;border-radius:8px;text-align:center;">
              <div style="font-size:20px;font-weight:700;color:#eab308;line-height:30px;padding-bottom:8px;overflow:visible;display:block;">${formatMacro(totals.carbs)}g</div>
              <div style="font-size:11px;color:#6b7280;">Carboidratos</div>
            </div>
            <div style="background-color:#fef2f2;padding:12px;border-radius:8px;text-align:center;">
              <div style="font-size:20px;font-weight:700;color:#ef4444;line-height:30px;padding-bottom:8px;overflow:visible;display:block;">${formatMacro(totals.fat)}g</div>
              <div style="font-size:11px;color:#6b7280;">Gorduras</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom:16px;">
          <h2 style="font-size:16px;font-weight:600;color:#1f2937;margin:0 0 8px 0;">Itens do Prato (${items.length})</h2>
          ${itemsHtml}
        </div>

        <div style="border-top:2px solid #e5e7eb;padding-top:16px;margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:14px;font-weight:600;color:#1f2937;">Total</span>
            <span style="font-size:14px;color:#10b981;font-weight:700;margin-left:12px;">${Math.round(totals.calories)} kcal</span>
          </div>
          <div style="font-size:12px;color:#6b7280;text-align:right;">
            <div>P: ${formatMacro(totals.protein)}g | C: ${formatMacro(totals.carbs)}g | G: ${formatMacro(totals.fat)}g</div>
          </div>
        </div>

        <div style="border-top:1px solid #e5e7eb;margin-top:20px;padding-top:12px;text-align:center;">
          <p style="font-size:10px;color:#9ca3af;margin:0;">
            Gerado por SiNutre - Calculadora Nutricional em ${new Date().toLocaleDateString('pt-BR')}
          </p>
          <p style="font-size:9px;color:#d1d5db;margin:4px 0 0 0;">
            Dados baseados na Tabela TACO - UNICAMP
          </p>
        </div>
      `;

      document.body.appendChild(content);

      const canvas = await html2canvas(content, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: content.scrollWidth,
        height: content.scrollHeight + 20,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight + 20,
        onclone: (doc) => {
          const elements = doc.querySelectorAll('*');
          elements.forEach((el: any) => {
            el.style.backgroundColor = el.style.backgroundColor || '#ffffff';
            el.style.color = el.style.color || '#000000';
          });
        },
      });

      document.body.removeChild(content);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('prato-nutricional.pdf');
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF');
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              className={`btn btn-sm ${profile === p.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setProfile(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button className="btn btn-sm btn-outline" onClick={exportarPDF}>
          Exportar PDF
        </button>
      </div>

      <div className="text-sm text-base-content/60 mb-4">
        Metas para {getProfileLabel()} · personalizadas pelo seu peso e altura
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="form-control w-32">
          <label className="label text-xs">Peso (kg)</label>
          <input
            type="number"
            className="input input-bordered input-sm"
            placeholder="70"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
        </div>
        <div className="form-control w-32">
          <label className="label text-xs">Altura (cm)</label>
          <input
            type="number"
            className="input input-bordered input-sm"
            placeholder="175"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
          />
        </div>
        {imc && (
          <div className="form-control">
            <label className="label text-xs">IMC</label>
            <div className="text-lg font-bold text-primary">{imc}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Digite o nome do alimento"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 bg-base-100 border rounded-box shadow w-full mt-1 max-h-60 overflow-auto">
                {suggestions.map((food) => (
                  <li
                    key={food.id}
                    className="px-4 py-2 hover:bg-base-200 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectSuggestion(food)}
                  >
                    <span>{food.name}</span>
                    <span className="text-xs text-base-content/60">
                      {Math.round(food.caloriesPer100g)} kcal
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="btn btn-ghost btn-sm mt-2"
            onClick={limpar}
          >
            Limpar tudo
          </button>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Seu Prato ({items.length})</h4>
            {items.length === 0 ? (
              <p className="text-sm text-base-content/60">Nenhum alimento adicionado</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-base-200 rounded"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-base-content/60 ml-2">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="text-xs text-base-content/60">G</label>
                        <input
                          type="number"
                          className="input input-bordered input-xs w-16"
                          value={item.grams}
                          onChange={(e) => handleUpdateGrams(item.id, Number(e.target.value))}
                          step="10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        {Math.round(item.calories)} kcal
                      </span>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-80">
          <div className="card bg-base-200 p-4">
            <h4 className="font-semibold mb-2">Calorias Totais</h4>
            <span className="text-3xl font-bold text-primary">
              {Math.round(totals.calories)} kcal
            </span>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center">
                <span className="text-xs text-base-content/60">Proteína</span>
                <p className="font-semibold">{formatMacro(totals.protein)}g</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-base-content/60">Carbos</span>
                <p className="font-semibold">{formatMacro(totals.carbs)}g</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-base-content/60">Gordura</span>
                <p className="font-semibold">{formatMacro(totals.fat)}g</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Calorias</span>
                  <span>{Math.round(totals.calories)} / {metas.calorias}</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2 mt-1">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min((totals.calories / metas.calorias) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Proteína</span>
                  <span>{formatMacro(totals.protein)} / {metas.proteinas}g</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((totals.protein / metas.proteinas) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Carbos</span>
                  <span>{formatMacro(totals.carbs)} / {metas.carbos}g</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2 mt-1">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${Math.min((totals.carbs / metas.carbos) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Gordura</span>
                  <span>{formatMacro(totals.fat)} / {metas.gorduras}g</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2 mt-1">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${Math.min((totals.fat / metas.gorduras) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}