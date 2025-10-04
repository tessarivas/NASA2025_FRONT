import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesAPI } from '../services/api';
import { useCurrentUser } from './useCurrentUser';

export const useFavorites = () => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const addToFavoritesMutation = useMutation({
    mutationFn: ({ articleId }) => favoritesAPI.addToFavorites(user._id, articleId),
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries(['userFavorites', user._id]);
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: ({ articleId }) => favoritesAPI.removeFromFavorites(user._id, articleId),
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries(['userFavorites', user._id]);
    },
    onError: (error) => {
      console.error('Error removing from favorites:', error);
    },
  });

  const addToFavorites = (articleId) => {
    if (!user?._id) {
      console.error('Cannot add to favorites: User ID is not available');
      return;
    }
    addToFavoritesMutation.mutate({ articleId });
  };

  const removeFromFavorites = (articleId) => {
    if (!user?._id) {
      console.error('Cannot remove from favorites: User ID is not available');
      return;
    }
    removeFromFavoritesMutation.mutate({ articleId });
  };

  return {
    addToFavorites,
    removeFromFavorites,
    isAddingToFavorites: addToFavoritesMutation.isPending,
    isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
    addError: addToFavoritesMutation.error,
    removeError: removeFromFavoritesMutation.error,
  };
};