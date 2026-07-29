import type { Icon } from '@phosphor-icons/react';
import {
  AppleLogo,
  ChartLineUp,
  Gear,
  House,
  Calculator,
} from '@phosphor-icons/react';

export interface NavItem {
  id: string;
  label: string;
  Icon: Icon;
  to: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: 'Início', Icon: House, to: "/" },
  { id: 'diet', label: 'Dieta', Icon: AppleLogo, to: "/foods" },
  { id: 'calculadoras', label: 'Calculadoras', Icon: Calculator, to: "/calculadoras" },
  { id: 'progress', label: 'Progresso', Icon: ChartLineUp, to: "/stats" },
  { id: 'settings', label: 'Configurações', Icon: Gear, to:"/settings" },
] as const;