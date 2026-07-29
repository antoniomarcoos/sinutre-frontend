import type { MacroSummary } from '@/types/meal';
import { formatMacro } from '@/utils/format';

interface MealMacrosSummaryProps {
  macros: Pick<MacroSummary, 'carbs' | 'proteins' | 'fats' | 'calories'>;
}

export function MealMacrosSummary({ macros }: MealMacrosSummaryProps) {
  return (
    <section className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8 bg-base-100">
      <div className="stat text-center">
        <div className="stat-title">Carboidratos</div>
        <div className="stat-value text-3xl">{formatMacro(macros.carbs)} g</div>
      </div>
      <div className="stat text-center">
        <div className="stat-title">Proteínas</div>
        <div className="stat-value text-3xl">{formatMacro(macros.proteins)} g</div>
      </div>
      <div className="stat text-center">
        <div className="stat-title">Gordura</div>
        <div className="stat-value text-3xl">{formatMacro(macros.fats)} g</div>
      </div>
      <div className="stat text-center bg-primary text-primary-content">
        <div className="stat-title text-primary-content/70">Calorias</div>
        <div className="stat-value text-3xl">{formatMacro(macros.calories)} kcal</div>
        <div className="stat-desc text-primary-content/70">Nesta refeição</div>
      </div>
    </section>
  );
}