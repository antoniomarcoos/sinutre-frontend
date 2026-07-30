import type { MacroSummary } from '@/types/meal';
import { MacroStat } from './MacroStat';
import { formatMacro } from '@/utils/format';

interface MacroStatsBarProps {
  summary: MacroSummary;
}

export function MacroStatsBar({ summary }: MacroStatsBarProps) {
  return (
    <section className="stats stats-vertical lg:stats-horizontal shadow-sm w-full bg-base-100">
      <MacroStat label="Carboidratos" value={formatMacro(summary.carbs)} unit="g" />
      <MacroStat label="Proteínas" value={formatMacro(summary.proteins)} unit="g" />
      <MacroStat label="Gordura" value={formatMacro(summary.fats)} unit="g" />
      <MacroStat
        label="Calorias / Meta Diária"
        value={formatMacro(summary.calories)}
        unit="kcal"
        variant={(summary.calories < summary.caloriesGoal) ? 'highlight' : 'danger'}
        goal={summary.caloriesGoal}
        hint="kcal"
      />
    </section>
  );
}