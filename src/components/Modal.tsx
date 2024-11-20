import React from 'react';
import { FiX, FiTrash2 } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-2">{message}</p>
        {itemName && (
          <p className="text-gray-800 font-medium mb-6">
            Do you want to delete flashcard "{itemName}"?
          </p>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg relative group flex items-center gap-2 transition-all duration-200"
          >
            <FiX size={18} />
            Cancel
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-red-600 hover:text-red-700 rounded-lg relative group flex items-center gap-2 transition-all duration-200"
          >
            <FiTrash2 size={18} />
            Delete
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 