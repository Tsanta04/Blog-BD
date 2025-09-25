import { Comments, Follower_user } from "@/utils/types";
import { baseUrl } from ".";

export const follow = async (follow:Follower_user,  accessToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/follow/${follow.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`, // 🔑 envoyer le token
        },
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

export const getFollowers = async (id_user:string,  accessToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/follower/${id_user}`, {
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

export const followerQuery = async (id_user:string, by_user:string, accessToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/isFollower/${id_user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`,
          body: JSON.stringify({
            user_id:id_user,
            follower_id:by_user
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
