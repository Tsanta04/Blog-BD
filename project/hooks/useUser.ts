import { useState, useEffect } from 'react';
import { User } from '@/utils/types';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers, searchUsersRes, getOneUser } from '@/services/api/users.api';
import { LikeQuery } from '@/services/api/like_user.api';
import { followerQuery } from '@/services/api/follower.api';

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

  const getUser = async (idUser:string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUser = await getOneUser(idUser,token?.accessToken);      
      setUsers(fetchedUser);
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

  useEffect(() => {
    fetchAllUsers();
  }, [token]);

  return {
    users,
    searchUsers,
    getUser,
    loading,
    error,
    refetch: fetchAllUsers,
  };
}