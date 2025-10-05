import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, ExternalLink } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { favoritesAPI } from '../../services/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function Article({ articles }) {
    const [showAll, setShowAll] = useState(false);
    const { user } = useCurrentUser();
    const { addToFavorites, removeFromFavorites, isAddingToFavorites, isRemovingFromFavorites } = useFavorites();

    // Get user's current favorites
    const { data: favoritesList = [] } = useQuery({
        queryKey: ['userFavorites', user?._id],
        queryFn: () => favoritesAPI.getUserFavorites(user._id),
        enabled: !!user?._id,
    });

    // Mostrar solo 3 artículos inicialmente
    const displayedArticles = showAll ? articles : articles.slice(0, 3);
    const hasMore = articles.length > 3;

    // Function to check if an article is favorited (by title)
    const isArticleFavorited = (article) => {
        return favoritesList.some(fav => fav.title === article.title);
    };

    // Function to handle favorite toggle
    const toggleFavorite = (article) => {
        if (!user?._id) {
            return;
        }

        const isFavorited = isArticleFavorited(article);

        if (isFavorited) {
            removeFromFavorites(article.title);
        } else {
            addToFavorites({
                title: article.title,
                year: article.year,
                authors: article.authors || [],
                tags: article.tags || [],
                doi: article.doi
            });
        }
    };

    // Function to handle article title click
    const handleArticleClick = (article) => {
        if (article.doi) {
            // Open DOI link in new tab
            window.open(`https://doi.org/${article.doi}`, '_blank');
        } else {
            // Fallback: search for the article title on Google Scholar
            const searchQuery = encodeURIComponent(`"${article.title}"`);
            window.open(`https://scholar.google.com/scholar?q=${searchQuery}`, '_blank');
        }
    };

    if (!articles || articles.length === 0) {
        return null;
    }

    const isLoading = isAddingToFavorites || isRemovingFromFavorites;

    return (
        <div className="mt-2 w-full">
            {/* Grid con 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
                {displayedArticles.map((article, idx) => {
                    const isFavorited = isArticleFavorited(article);
                    
                    return (
                        <div
                            key={idx}
                            className="bg-gradient-to-br from-[#1a1f3a]/20 to-[#0f1320]/80 backdrop-blur-xs 
                            border-2 border-white/40 rounded-3xl px-4 py-3 hover:border-white/60 
                            transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-[1.02] flex flex-col relative"
                        >
                            {/* Botón de estrella para favoritos */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(article);
                                }}
                                disabled={isLoading}
                                className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 
                                transition-all duration-200 hover:scale-110 group cursor-pointer disabled:opacity-50"
                                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Star 
                                    size={16} 
                                    className={`transition-all duration-200 ${
                                        isFavorited 
                                            ? 'fill-[#F63564] text-[#F63564]' 
                                            : 'text-white/60 group-hover:text-[#F63564]'
                                    } ${isLoading ? 'animate-pulse' : ''}`}
                                />
                            </button>

                            {/* Título del artículo - clickable */}
                            <button
                                onClick={() => handleArticleClick(article)}
                                className="text-left w-full group/title"
                            >
                                <h3
                                    className="text-white font-bold text-sm mb-1 leading-snug pr-8"
                                    style={{ fontFamily: 'Space Mono, monospace' }}
                                >
                                    {article.title}
                                    <ExternalLink className="w-3 h-3 mt-1 opacity-60 group-hover/title:opacity-100 transition-opacity" />
                                </h3>
                            </button>

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

                            {/* DOI */}
                            {article.doi && (
                                <div className="text-xs">
                                    <span
                                        className="text-orange font-bold"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        DOI:{' '}
                                    </span>
                                    <button
                                        onClick={() => handleArticleClick(article)}
                                        className="text-blue-300 hover:text-blue-200 underline transition-colors"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        {article.doi}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    );
                })}
            </div>

            {/* Botón Ver más / Ver menos */}
            {hasMore && (
                <div className="mt-3 flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="py-2 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.05] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
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
