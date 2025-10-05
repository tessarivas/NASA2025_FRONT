import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

export default function Article({ articles }) {
    const [showAll, setShowAll] = useState(false);
    const [favorites, setFavorites] = useState(new Set());

    // Mostrar solo 3 artículos inicialmente
    const displayedArticles = showAll ? articles : articles.slice(0, 3);
    const hasMore = articles.length > 3;

    // Función para toggle de favoritos
    const toggleFavorite = (articleIndex) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(articleIndex)) {
                newFavorites.delete(articleIndex);
            } else {
                newFavorites.add(articleIndex);
            }
            return newFavorites;
        });
    };

    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <div className="mt-2 w-full">
            {/* Grid con 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
                {displayedArticles.map((article, idx) => (
                    <div
                        key={idx}
                        className="bg-gradient-to-br from-[#1a1f3a]/20 to-[#0f1320]/80 backdrop-blur-xs 
                        border-2 border-white/40 rounded-3xl px-4 py-3 hover:border-white/60 
                        transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-[1.02] flex flex-col relative"
                    >
                        {/* Botón de estrella para favoritos */}
                        <button
                            onClick={() => toggleFavorite(idx)}
                            className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 
                            transition-all duration-200 hover:scale-110 group cursor-pointer"
                            title={favorites.has(idx) ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Star 
                                size={16} 
                                className={`transition-all duration-200 ${
                                    favorites.has(idx) 
                                        ? 'fill-[#F63564] text-[#F63564]' 
                                        : 'text-white/60 group-hover:text-[#F63564]'
                                }`}
                            />
                        </button>

                        {/* Título del artículo */}
                        <h3
                            className="text-white font-bold text-md mb-1 leading-snug pr-8"
                            style={{ fontFamily: 'Space Mono, monospace' }}
                        >
                            {article.title}
                        </h3>

                        <div className="space-y-1.0 text-xs">
                            {/* Year */}
                            {article.year && (
                                <div>
                                    <span
                                        className="text-orange font-bold"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        Year:{' '}
                                    </span>
                                    <span
                                        className="text-white/90"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        {article.year}
                                    </span>
                                </div>
                            )}

                            {/* Authors */}
                            {article.authors && article.authors.length > 0 && (
                                <div className="text-xs">
                                    <span
                                        className="text-orange font-bold"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        Author:{' '}
                                    </span>
                                    <span
                                        className="text-white/90"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        {article.authors.join(' & ')}
                                    </span>
                                </div>
                            )}

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="text-xs">
                                    <span
                                        className="text-orange font-bold"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        Tags:{' '}
                                    </span>
                                    <span
                                        className="text-white/90"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        {article.tags.join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Botón Ver más / Ver menos */}
            {hasMore && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="py-3 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.05] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                        style={{ fontFamily: 'Space Mono, monospace' }}
                    >
                        {showAll ? (
                            <>
                                <span>Show Less</span>
                                <ChevronUp size={20} />
                            </>
                        ) : (
                            <>
                                <span>See More</span>
                                <ChevronDown size={20} />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
