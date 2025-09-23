import { useState, useEffect } from 'react';
import { User } from '@/utils/types';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers, searchUsersRes, getOneUser } from '@/services/api/users.api';
import { LikeQuery ,  like_user } from '@/services/api/like_user.api';
import { followerQuery, follow } from '@/services/api/follower.api';

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token,user } = useAuth();

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUser = await getAllUsers(token?.accessToken);      
      setUsers(fetchedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (idUser?:string) => {
    if(!idUser) idUser = user?.id || "";    
    try {
      setLoading(true);
      setError(null);
      const fetchedUser = await getOneUser(idUser,token?.accessToken);           
      return fetchedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };  
  
  const searchUsers = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await searchUsersRes(query, token?.accessToken);
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };


  const isLikedByMe = async (user_owner_id: string) => {
    try {
      setLoading(true);
      setError(null);
      const isLiked = await LikeQuery(user_owner_id, user?.id||"" ,token?.accessToken||"");
      return isLiked;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const isFollowedByMe = async (user_owner_id: string) => {
    try {
      setLoading(true);
      setError(null);
      const isFollowed = await followerQuery(user_owner_id, user?.id||"" ,token?.accessToken||"");
      return isFollowed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (toLikeId: string) => {
    if (!token) return;
    const user = users.find(p => p.id === toLikeId);
    if (!user) return;

    try {
      await like_user({ user_id: toLikeId, liker_id: user?.id || "" }, token.accessToken);
      return true;

    } catch (error) {
      console.error('Error toggling like:', error);
    }
    return false;
  };

  const toggleFollow = async (toFollowId: string) => {
    if (!token) return;
    const user = users.find(p => p.id === toFollowId);
    if (!user) return;

    try {
      await follow({ user_id: toFollowId, follower_id: user?.id || "" }, token.accessToken);
      return true;

    } catch (error) {
      console.error('Error toggling like:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchAllUsers();
  }, [token]);

  return {
    users,
    searchUsers,
    getUser,
    loading,
    error,
    toggleFollow,toggleLike,
    isFollowedByMe,isLikedByMe,
    refetch: fetchAllUsers,
  };
}