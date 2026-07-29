import { useState, useEffect, useMemo } from 'react';
import { AddMealCard } from '@/components/cards/AddMealCard';
import { TotalMealsCard } from '@/components/cards/TotalMealsCard';
import { Header } from '@/components/layout/Header';
import { MacroStatsBar } from '@/components/macros/MacroStatsBar';
import { MealFab } from '@/components/meals/MealFab';
import { MealsList } from '@/components/meals/MealsList';
import { MealsTable } from '@/components/meals/MealsTable';
import { MealFilters } from '@/components/meals/MealFilters';
import { AddMealModal } from '@/components/modal/AddMealModal';
import { useAuth } from '@/context/AuthContext';
import { Meal } from '@/types/mealSummary';
import { api } from '@/lib/api';
import { useMealModal } from '@/hooks/useMealModal';
import { DeleteConfirmationModal } from '@/components/modal/DeleteConfirmationModal';
import { ViewMealModal } from '@/components/modal/ViewMealModal';
import { WaterCard } from '@/components/water/WaterCard';
import { RefeicaoSugestao } from '@/components/ia/RefeicaoSugestao';

interface DashboardPageProps {
  drawerId: string;
}

export function DashboardPage({ drawerId }: DashboardPageProps) {
  const { user } = useAuth();
  if (!user) return <></>;

  const modal = useMealModal();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userGoals, setUserGoals] = useState({ caloriesGoal: 2000, waterGoal: 2000 });

  async function loadMeals(filters?: { startDate: string; endDate: string; type: string }) {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.type && filters.type !== 'todos') params.append('type', filters.type);

      const response = await api.get(`/meals?${params.toString()}`);
      setMeals(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserGoals() {
    try {
      const response = await api.get('/user/goals');
      setUserGoals(response.data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  }

  useEffect(() => {
    loadMeals();
    loadUserGoals();
  }, []);

  const handleView = (meal: Meal) => {
    setSelectedMeal(meal);
    setModalType('view');
  };

  const handleEdit = (meal: Meal) => {
    setSelectedMeal(meal);
    setModalType('edit');
  };

  const handleDelete = (meal: Meal) => {
    setSelectedMeal(meal);
    setModalType('delete');
  };

  const closeModal = () => {
    setSelectedMeal(null);
    setModalType(null);
  };

  const confirmDelete = async () => {
    if (!selectedMeal) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/meals/${selectedMeal.id}`);
      await loadMeals();
      closeModal();
    } catch (error) {
      alert('Erro ao excluir a refeição.');
    } finally {
      setDeleteLoading(false);
    }
  };

  function handleFilter(newFilters: { startDate: string; endDate: string; type: string }) {
    loadMeals(newFilters);
  }

  function handleClearFilters() {
    loadMeals({ startDate: '', endDate: '', type: 'todos' });
  }

  const mealsSummary = useMemo(() => {
    const today = new Date();
    const total = meals.length;
    const todayCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;
    const monthCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;
    return { total, thisMonth: monthCount, today: todayCount };
  }, [meals]);

  const macroSummary = useMemo(() => {
    const today = new Date();
    return meals
      .filter((meal) => {
        const date = new Date(meal.eatTime);
        return (
          date.getDay() === today.getDay() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      })
      .reduce(
        (acc, meal) => {
          acc.carbs += meal.totals.carbs;
          acc.proteins += meal.totals.proteins;
          acc.fats += meal.totals.fats;
          acc.calories += meal.totals.calories;
          return acc;
        },
        {
          carbs: 0,
          proteins: 0,
          fats: 0,
          calories: 0,
          caloriesGoal: userGoals.caloriesGoal || 2000,
        }
      );
  }, [meals, userGoals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-gray-500">Carregando...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mb-8">
        <Header drawerId={drawerId} userName={user.name} avatarUrl={user.avatarUrl} />
        <MacroStatsBar summary={macroSummary} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
          <TotalMealsCard summary={mealsSummary} />
          <AddMealCard onSelectCategory={modal.openWith} />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <WaterCard />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <RefeicaoSugestao onSaved={loadMeals} />
        </div>

        <MealFilters onFilter={handleFilter} onClear={handleClearFilters} />

        <MealsTable
          meals={meals}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <MealsList
          meals={meals}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <MealFab onSelectCategory={modal.openWith} />

      <AddMealModal
        open={modal.open}
        typeMeal={modal.selectedCategory}
        onClose={modal.close}
        onSave={modal.close}
        onMealCreated={() => loadMeals()}
      />

      {modalType === 'delete' && selectedMeal && (
        <DeleteConfirmationModal
          meal={selectedMeal}
          onConfirm={confirmDelete}
          onCancel={closeModal}
          loading={deleteLoading}
        />
      )}

      {modalType === 'view' && selectedMeal && (
        <ViewMealModal meal={selectedMeal} onClose={closeModal} />
      )}

      {modalType === 'edit' && selectedMeal && (
        <AddMealModal
          open={true}
          typeMeal={selectedMeal.type}
          onClose={closeModal}
          onSave={() => {
            loadMeals();
            closeModal();
          }}
          onMealCreated={() => loadMeals()}
          editingMeal={selectedMeal}
        />
      )}
    </>
  );
}