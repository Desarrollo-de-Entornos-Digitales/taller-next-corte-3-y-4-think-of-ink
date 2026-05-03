'use client';

import { InfoCard } from './InfoCard';

interface CardData {
    id: number;
    autor: string;
    ubicacion: string;
    titulo: string;
    categoria: string;
    descripcion: string;
    imagenes?: number[];
}

interface CardListProps {
    items: CardData[];
}

export const CardList = ({ items }: CardListProps) => {
    return (
        <div className="flex flex-col gap-2">
            {items.map((item) => (
                <InfoCard
                    key={item.id}
                    autor={item.autor}
                    ubicacion={item.ubicacion}
                    titulo={item.titulo}
                    descripcion={item.descripcion}
                    categoria={item.categoria}
                    imagenes={item.imagenes}
                />
            ))}
        </div>
    );
};
