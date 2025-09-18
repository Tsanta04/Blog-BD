import { Comments, Follower_user } from "@/utils/types";
import { baseUrl } from ".";

export const follow = async (follow:Follower_user) => {
    try {
      const response = await fetch(`${baseUrl}/follow/${follow.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_id: follow.follower_id
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

export const getFollowers = async (id_user:string) => {
    try {
      const response = await fetch(`${baseUrl}/follower/${id_user}`, {
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
