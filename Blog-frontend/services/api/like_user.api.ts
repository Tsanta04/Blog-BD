import { Likes_users } from "@/utils/types";
import { baseUrl } from ".";

export const like_user = async (like:Likes_users) => {
    try {
      const response = await fetch(`${baseUrl}/like_user/${like.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: like.liker_id
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

export const getLikes = async (id_user:string) => {
    try {
      const response = await fetch(`${baseUrl}/like_user/${id_user}`, {
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
