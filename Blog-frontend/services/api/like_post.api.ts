import { Likes_posts } from "@/utils/types";
import { baseUrl } from ".";

export const like_post = async (like: Likes_posts, token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/like_post/${like.post_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ user_id: like.user_id }),
    });

    if (!response.ok) throw new Error("Failed to like post");
    return response.json();
  } catch (e: any) {
    console.error("Error liking post:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};

export const getLikes = async (id_post: string, token?: string) => {
  try {
    const response = await fetch(`${baseUrl}/like_post/${id_post}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Failed to get likes");
    return response.json();
  } catch (e: any) {
    console.error("Error getting likes:", e);
    throw new Error(e.response?.data?.message || "Erreur de connexion");
  }
};
