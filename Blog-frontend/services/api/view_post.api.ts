import { Comments, Follower_user, Likes_posts } from "@/utils/types";
import { baseUrl } from ".";

export const view_post = async (view:Likes_posts) => {
    try {
      const response = await fetch(`${baseUrl}/view_post/${view.post_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: view.user_id
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

export const getViews = async (id_post:string) => {
    try {
      const response = await fetch(`${baseUrl}/view_post/${id_post}`, {
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
