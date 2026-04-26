'use client';

interface InfoCardProps {
    titulo: string;
    descripcion: string;
    categoria: string;
    fecha: string;
    onVerMas?: () => void;
}

export const InfoCard = ({ titulo, descripcion, categoria, fecha, onVerMas }: InfoCardProps) => {
    return (
        <div className="card bg-base-100 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
            <div className="card-body">
                <div className="flex justify-between items-start">
                    <h2 className="card-title text-primary">{titulo}</h2>
                    <div className="badge badge-secondary">{categoria}</div>
                </div>

                <p className="py-2 text-gray-600 text-sm line-clamp-3">{descripcion}</p>

                <div className="card-actions justify-end mt-4 border-t pt-4">
                    <span className="text-xs text-gray-400 self-center">{fecha}</span>
                    <button onClick={onVerMas} className="btn btn-primary btn-sm">
                        Ver más
                    </button>
                </div>
            </div>
        </div>
    );
};
