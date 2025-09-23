import { Likes_users } from "@/utils/types";
import { baseUrl } from ".";

export const like_user = async (like:Likes_users ,accessToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/like_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`, // 🔑 envoyer le token
        },
        body: JSON.stringify({
          user_id: like.user_id,
          liker_id: like.liker_id
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

export const getLikes = async (id_user:string,  accessToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/like_user/${id_user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`, // 🔑 envoyer le token            
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


export const LikeQuery = async (id_user:string, by_user:string, accessToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/isLiked/${id_user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`, // 🔑 envoyer le token
          body: JSON.stringify({
            user_id:id_user,
            liker_id:by_user
          })
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
