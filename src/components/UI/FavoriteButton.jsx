import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { favoritesAPI } from '../../services/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const FavoriteButton = ({ articleId, className = '', size = 'w-5 h-5' }) => {
  const { user } = useCurrentUser();
  const { addToFavorites, removeFromFavorites, isAddingToFavorites, isRemovingFromFavorites } = useFavorites();

  const { data: favoritesList = [] } = useQuery({
    queryKey: ['userFavorites', user?._id],
    queryFn: () => favoritesAPI.getUserFavorites(user._id),
    enabled: !!user?._id,
  });

  const isFavorited = favoritesList.includes(articleId);
  const isLoading = isAddingToFavorites || isRemovingFromFavorites;

  const handleToggleFavorite = () => {
    if (isLoading) return;
    
    // Verificar que el usuario existe y tiene un ID válido
    if (!user?._id) {
      console.error('User ID is not available. User must be logged in to use favorites.');
      return;
    }

    if (isFavorited) {
      removeFromFavorites(articleId);
    } else {
      addToFavorites(articleId);
    }
  };

  // Si no hay usuario, no mostrar el botón
  if (!user?._id) {
    return null;
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`transition-all duration-200 ${
        isFavorited
          ? 'text-pink-400 hover:text-pink-300'
          : 'text-white/40 hover:text-pink-400'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`${size} ${isFavorited ? 'fill-current' : ''} ${
          isLoading ? 'animate-pulse' : ''
        }`} 
      />
    </button>
  );
};

export default FavoriteButton;