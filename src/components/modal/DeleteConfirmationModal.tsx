import { Meal } from "@/types/mealSummary";

interface DeleteConfirmationModalProps {
  meal: Meal;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmationModal({ 
  meal, 
  onConfirm, 
  onCancel, 
  loading = false 
}: DeleteConfirmationModalProps) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error">Excluir Refeição</h3>
        <p className="py-4">
          Tem certeza que deseja excluir a refeição <strong>"{meal.name}"</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="modal-action">
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn btn-error" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}