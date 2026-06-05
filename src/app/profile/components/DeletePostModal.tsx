'use client';

import { useState } from 'react';

interface DeletePostModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
    postId: string;
}

export const DeletePostModal = ({
    isOpen,
    onCancel,
    onConfirm,
    postId,
}: DeletePostModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-black">Eliminar publicación</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 font-medium">
                        ¿Deseas eliminar esta publicación?
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-6 py-2 text-sm font-bold border-2 border-gray-300 rounded-md hover:border-black transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="px-6 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting && <span className="loading loading-spinner loading-sm"></span>}
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};
