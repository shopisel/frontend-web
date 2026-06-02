import { motion } from "motion/react";

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Apagar lista?</p>
          <p className="text-gray-400 mt-2" style={{ fontSize: 13 }}>Esta ação não pode ser desfeita.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            Apagar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
