import React from 'react';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, onConfirm, title, message, confirmButtonText = "Delete" }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-slate-300">{message}</p>
        <div className="flex gap-4 mt-2">
            <button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 rounded-md transition-colors">
                Cancel
            </button>
            <button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-md transition-colors">
                {confirmButtonText}
            </button>
        </div>
      </div>
    </div>
  );
};
