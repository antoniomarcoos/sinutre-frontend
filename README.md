# Nutridash

Dashboard de nutrição em React, convertido a partir do protótipo HTML original
em `../Nutridash`. Toda a estilização foi migrada para Tailwind CSS (com daisyUI
v5 como plugin) e a UI foi quebrada em componentes reutilizáveis.

## Funcionalidades

- Autenticação via GitHub e Google OAuth
- Dashboard com resumo de refeições e macros
- CRUD completo de refeições
- CRUD completo de alimentos
- Busca de alimentos com sugestões da TACO
- Calculadoras de IMC, gasto calórico e nutricional
- Sugestão de refeições com IA (Gemini) - *experimental*
- Página de progresso com gráficos
- Consumo de água com meta personalizada
- Edição de perfil e metas do usuário
- Tema escuro/claro
- Favoritar alimentos
- Exportação de dados em CSV e PDF
- Feedback visual com toasts

## Stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- daisyUI v5 (plugin do Tailwind)
- @phosphor-icons/react para os ícones
- ESLint 9 (flat config) + typescript-eslint
- react-hot-toast para notificações
- recharts para gráficos
- @google/generative-ai para IA

## Estrutura

```src/
├── components/
│   ├── calculadoras/  # IMCCalculator, GastoCaloricoCalculator, CalculadoraNutricional
│   ├── cards/         # AddMealCard, TotalMealsCard
│   ├── forms/         # FormField
│   ├── ia/            # RefeicaoSugestao
│   ├── layout/        # Sidebar, SidebarBrand, SidebarItem, Header
│   ├── macros/        # MacroStat, MacroStatsBar
│   ├── meals/         # MealActionButton, MealFab, MealsList/Table, MealFilters
│   ├── modal/         # AddMealModal, EditFoodModal, DeleteConfirmationModal, ViewMealModal
│   ├── profile/       # EditProfileModal
│   └── water/         # WaterCard
├── constants/         # MEAL_CATEGORIES, NAV_ITEMS
├── context/           # AuthContext, ThemeContext
├── data/              # mocks
├── hooks/             # useMealModal
├── pages/             # DashboardPage, DietFoodPage, CalculadorasPage, ProgressPage, SettingsPage
├── services/          # api, foodService, mealService, ia.service
├── styles/            # tailwind + tema sinutre
├── types/             # tipos de domínio
├── utils/             # funções auxiliares (format, date)
├── App.tsx
└── main.tsx
```
## Scripts

```bash
npm install     # instala dependências
npm run dev     # servidor de desenvolvimento (vite)
npm run build   # build de produção (tsc -b + vite build)
npm run lint    # ESLint em todo o projeto
npm run preview # preview do build
```

## Tema

O tema customizado `sinutre` (paleta verde) está definido em
`src/styles/theme.css` usando a sintaxe `@plugin 'daisyui/theme'` do daisyUI v5.