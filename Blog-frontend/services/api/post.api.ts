import { Post } from "@/utils/types";
import { baseUrl } from ".";

export const createPost = async (post:Post) => {
    try {
      const response = await fetch(`${baseUrl}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          user_id: post.user_id,
          medias: JSON.stringify(post.medias),
          tags: JSON.stringify(post.tags)
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

export const getPost = async (id:number) => {
    try {
      const response = await fetch(`${baseUrl}/post/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();        
        return data;
      } else {
        throw new Error('Failed to get post');
      }
    } catch (e:any) {
      console.error('Error getting post:', e);  
      throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const deletePost = async (id:string) => {
    try {
      const response = await fetch(`${baseUrl}/post/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();        
        return data;
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (e:any) {
      console.error('Error deleting post:', e);  
      throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const getPostsUser = async (id_user: string) => {
    try {
      const response = await fetch(`${baseUrl}/posts/${id_user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();        
        return data;
      } else {
        throw new Error('Failed to get posts');
      }
    } catch (e:any) {
      console.error('Error getting posts:', e);  
      throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}