import { Post, User } from "@/utils/types";
import { baseUrl } from ".";

export const getOneUser = async (id: string, token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Failed to get post");
    const data = await response.json();
    return data.post;
  } catch (e: any) {
    console.error("Error getting post:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};

export const searchUsersRes = async (query: string, token?: string): Promise<User[]> => {
  try {
    const url = new URL(`${baseUrl}/users/search`);
    url.searchParams.append('q', query); 

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error('Failed to search posts');
    const data = await response.json();
    return data.posts as User[]; // supposons que l'API retourne { posts: [...] }
  } catch (e: any) {
    console.error('Error searching posts:', e);
    throw new Error(e.message || 'Erreur de connexion');
  }
};

export const getAllUsers = async (token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Failed to get posts");
    const data = await response.json();
    return data.data;
  } catch (e: any) {
    console.error("Error getting posts:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};
