import { Comments } from "@/utils/types";
import { baseUrl } from ".";

export const commentPost = async (coms: Comments, accessToken: string) => {
  try {
    const response = await fetch(`${baseUrl}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        content: coms.content,
        post_id: coms.post_id,
        user_id: coms.user_id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to create comment');
    }
  } catch (e: any) {
    console.error('Error creating comment:', e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
}

export const getPostComment = async (id: number, accessToken: string) => {
  try {
    const response = await fetch(`${baseUrl}/comment/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();        
      return data;
    } else {
      throw new Error('Failed to get comments');
    }
  } catch (e: any) {
    console.error('Error getting comments:', e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
}

export const updateComment = async (coms: Comments, accessToken: string) => {
  try {
    const response = await fetch(`${baseUrl}/comment/${coms.id}`, {
      method: 'PUT', // corrigé pour update
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        content: coms.content
      }),
    });

    if (response.ok) {
      const data = await response.json();        
      return data;
    } else {
      throw new Error('Failed to update comment');
    }
  } catch (e: any) {
    console.error('Error updating comment:', e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
}
