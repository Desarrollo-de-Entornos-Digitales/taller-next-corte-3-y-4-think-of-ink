'use client';

interface CategoryFilterProps {
    categories: string[];
    active: string;
    onSelect: (category: string) => void;
}

export const CategoryFilter = ({ categories, active, onSelect }: CategoryFilterProps) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                        active === category
                            ? 'bg-[#6000FF] text-white'
                            : 'bg-white text-black border border-[#D9D9D9] hover:border-black'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};
