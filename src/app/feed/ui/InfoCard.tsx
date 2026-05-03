'use client';

interface InfoCardProps {
    titulo: string;
    descripcion: string;
    categoria: string;
    autor: string;
    ubicacion: string;
    imagenes?: number[];
    onVerMas?: () => void;
}

export const InfoCard = ({
    titulo,
    descripcion,
    categoria,
    autor,
    ubicacion,
    imagenes = [],
    onVerMas,
}: InfoCardProps) => {
    return (
        <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-black transition-colors group">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                    <span className="text-[10px]">👤</span>
                </div>
                <div>
                    <p className="text-xs font-bold">{autor}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{ubicacion}</p>
                </div>
                <div className="ml-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                        {categoria}
                    </span>
                </div>
            </div>

            <h4 className="text-sm font-bold mb-1 tracking-tight">{titulo}</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-3">{descripcion}</p>

            {imagenes.length > 0 && (
                <div className={`grid gap-2 mb-4 ${imagenes.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}>
                    {imagenes.map((_, i) => (
                        <div
                            key={i}
                            className={`bg-[#D9D9D9] border border-gray-200 rounded flex items-center justify-center relative overflow-hidden 
                                ${imagenes.length === 1 ? 'aspect-[2.5/1]' : 'aspect-square'}`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                <div className="w-[150%] h-[0.5px] bg-black rotate-[20deg]"></div>
                                <div className="w-[150%] h-[0.5px] bg-black -rotate-[20deg]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    onClick={onVerMas}
                    className="text-[10px] font-black uppercase tracking-[0.15em] border-b-2 border-transparent hover:border-black transition-all"
                >
                    Ver detalles
                </button>
            </div>
        </div>
    );
};
