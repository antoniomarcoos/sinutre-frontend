import { useEffect, useState } from 'react';
import { Plus, Trash, Pencil, Star } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';
import { EditFoodModal } from '@/components/modal/EditFoodModal';

import { getFoods, updateFood, deleteFood } from '@/services/foodService';
import type { Food } from '@/types/food';
import { formatMacro } from '@/utils/format';

const MODAL_ID = 'create-food-modal';
const DELETE_MODAL_ID = 'delete-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodToDelete, setFoodToDelete] = useState<string | number | null>(null);
  const [foodToEdit, setFoodToEdit] = useState<Food | null>(null);

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

  function openEditModal(food: Food) {
    setFoodToEdit(food);
  }

  function closeEditModal() {
    setFoodToEdit(null);
  }

  async function handleDelete() {
    if (!foodToDelete) return;
    
    try {
      await deleteFood(String(foodToDelete));
      toast.success('Alimento excluído com sucesso');
      loadFoods();
      closeDeleteModal();
    } catch (error) {
      toast.error('Erro ao excluir alimento');
      console.error(error);
    }
  }

  async function handleToggleFavorite(food: Food) {
    try {
      await updateFood(String(food.id), {
        isFavorite: !food.isFavorite,
        name: food.name,
        caloriesPer100g: food.caloriesPer100g,
        carbsPer100g: food.carbsPer100g,
        proteinPer100g: food.proteinPer100g,
        fatPer100g: food.fatPer100g,
      });
      toast.success(food.isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
      loadFoods();
    } catch (error) {
      toast.error('Erro ao atualizar favorito');
      console.error(error);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  const favoriteFoods = foods.filter(f => f.isFavorite);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {favoriteFoods.length > 0 && (
        <div className="mt-6 mb-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Star size={20} className="text-yellow-500 fill-yellow-500" />
            Favoritos
          </h3>
          <div className="grid gap-3">
            {favoriteFoods.map((food) => (
              <div key={food.id} className="card bg-base-100 shadow-sm p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{food.name}</span>
                  <button
                    onClick={() => handleToggleFavorite(food)}
                    className="btn btn-ghost btn-xs btn-square text-yellow-500"
                  >
                    <Star size={18} weight="fill" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggleFavorite(food)}
                      className={`btn btn-ghost btn-sm btn-square ${food.isFavorite ? 'text-yellow-500' : 'text-base-content/30'}`}
                    >
                      <Star size={20} weight={food.isFavorite ? 'fill' : 'regular'} />
                    </button>
                    <button
                      onClick={() => openEditModal(food)}
                      className="btn btn-ghost btn-sm btn-square text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil size={20} weight="bold" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(food.id)}
                      className="btn btn-ghost btn-sm btn-square text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash size={20} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                  <span>
                    🔥 {formatMacro(food.caloriesPer100g)} kcal
                  </span>
                  <span>
                    🍞 {formatMacro(food.carbsPer100g)} g
                  </span>
                  <span>
                    🍗 {formatMacro(food.proteinPer100g)} g
                  </span>
                  <span>
                    🥑 {formatMacro(food.fatPer100g)} g
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

      <EditFoodModal
        food={foodToEdit}
        onUpdated={loadFoods}
        onClose={closeEditModal}
      />
    </div>
  );
}