import { Comments } from "@/utils/types";
import { baseUrl } from ".";

export const commentPost = async (coms:Comments) => {
    try {
      const response = await fetch(`${baseUrl}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: coms.content,
            post_id: coms.post_id,
            user_id: coms.user_id
        }),
      });
      console.log(response);
      

      if (response.ok) {
        const data = await response.json();
        return data
      } else {
        throw new Error('Failed to create post');
      }
    } catch (e:any) {
      console.error('Error creating posts:', e);  
      throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const getPostComment = async (id:number) => {
    try {
      const response = await fetch(`${baseUrl}/comment/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();        
        return data;
      } else {
        throw new Error('Failed to get comments');
      }
    } catch (e:any) {
      console.error('Error getting comments:', e);  
      throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const updateComment = async (coms:Comments) => {
    try {
      const response = await fetch(`${baseUrl}/comment/${coms.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();        
        return data;
      } else {
        throw new Error('Failed to update comments');
      }
    } catch (e:any) {
      console.error('Error updating comments:', e);  
      throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}