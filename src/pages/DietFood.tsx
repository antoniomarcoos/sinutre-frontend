import { useEffect, useState } from 'react';
import { Plus, Trash } from '@phosphor-icons/react';

import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';

import { getFoods } from '@/services/foodService';
import { api } from '@/lib/api';
import type { Food } from '@/types/food';

const MODAL_ID = 'create-food-modal';
const DELETE_MODAL_ID = 'delete-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodToDelete, setFoodToDelete] = useState<string | number | null>(null);

  async function loadFoods() {
    try {
      const data = await getFoods();
      setFoods(data);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(id: string | number) {
    setFoodToDelete(id);
    const modal = document.getElementById(DELETE_MODAL_ID) as HTMLDialogElement;
    modal?.showModal();
  }

  function closeDeleteModal() {
    setFoodToDelete(null);
    const modal = document.getElementById(DELETE_MODAL_ID) as HTMLDialogElement;
    modal?.close();
  }

  async function handleDelete() {
    if (!foodToDelete) return;
    
    try {
      await api.delete(`/foods/${foodToDelete}`);
      loadFoods();
      closeDeleteModal();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="card bg-base-100 shadow-sm"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">
                    {food.name}
                  </h2>
                  <button
                    onClick={() => openDeleteModal(food.id)}
                    className="btn btn-ghost btn-sm btn-square text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                  <span>
                    🔥 {food.caloriesPer100g} kcal
                  </span>

                  <span>
                    🍞 {food.carbsPer100g} g
                  </span>

                  <span>
                    🍗 {food.proteinPer100g} g
                  </span>

                  <span>
                    🥑 {food.fatPer100g} g
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
        onClick={() =>
          (
            document.getElementById(
              MODAL_ID,
            ) as HTMLDialogElement
          )?.showModal()
        }
      >
        <Plus size={24} weight="bold" />
      </button>

      <AddFoodModal
        modalId={MODAL_ID}
        onCreated={loadFoods}
      />

      <dialog id={DELETE_MODAL_ID} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Excluir alimento</h3>
          <p className="py-4">Tem certeza que deseja excluir este alimento? Esta ação não pode ser desfeita.</p>
          <div className="modal-action">
            <button onClick={closeDeleteModal} className="btn">
              Cancelar
            </button>
            <button onClick={handleDelete} className="btn btn-error text-white">
              Excluir
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeDeleteModal}>fechar</button>
        </form>
      </dialog>
    </div>
  );
}