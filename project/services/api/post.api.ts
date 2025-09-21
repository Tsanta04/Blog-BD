import { Post } from "@/utils/types";
import { baseUrl } from ".";

export const createPost = async (post: Post, token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        user_id: post.user_id,
        medias: JSON.stringify(post.medias),
        tags: JSON.stringify(post.tags),
      }),
    });

    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  } catch (e: any) {
    console.error("Error creating post:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};

export const getPost = async (id: number, token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/post/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Failed to get post");
    return response.json();
  } catch (e: any) {
    console.error("Error getting post:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};

export const deletePost = async (id: string, token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/post/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Failed to delete post");
    return response.json();
  } catch (e: any) {
    console.error("Error deleting post:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};

export const getPostsUser = async (id_user: string, token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/posts/${id_user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Failed to get posts");
    return response.json();
  } catch (e: any) {
    console.error("Error getting posts:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};
