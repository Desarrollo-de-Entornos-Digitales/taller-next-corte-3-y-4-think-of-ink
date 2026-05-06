'use client';

import { useState } from 'react';
import { InfoCard } from './InfoCard';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { Pagination } from '../../components/Pagination';

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
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 2;

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const currentItems = items.slice(start, end);

    if (loading) {
        return <Loader />;
    }

    if (!items || items.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            <div className="flex flex-col gap-2">
                {currentItems.map((item) => (
                    <InfoCard
                        key={item.id}
                        autor={item.autor}
                        ubicacion={item.ubicacion}
                        titulo={item.titulo}
                        descripcion={item.descripcion}
                        categoria={item.categoria}
                        imagenes={item.imagenes}
                        onVerMas={() => console.log(`Ver publicación ${item.id}`)}
                    />
                ))}
            </div>

            <Pagination page={page} setPage={setPage} />
        </div>
    );
};