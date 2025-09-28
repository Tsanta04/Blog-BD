import { baseUrl } from ".";

// --- me() : récupère l'utilisateur connecté ---
export const me = async (accessToken: string) => {
  try {
    const res = await fetch(`${baseUrl}/moi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, // 🔑 envoyer le token
      },
    });

    if (!res.ok) return null;

    const data = (await res.json()).data;
    
    return data.user as any; // ou User selon ton type
  } catch (e: any) {
    throw new Error(e?.message || "Erreur de connexion");
  }
};

// --- logIn() : renvoie user + token ---
export const logIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Invalid credentials");

    const data = (await response.json()).data;
    return {
      user: data.user,
      token: data.token as { accessToken: string; refreshToken: string },
    };
  } catch (e: any) {
    throw new Error(e?.message || "Erreur de connexion");
  }
};

// --- register() : renvoie user + token ---
export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${baseUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) throw new Error("Invalid credentials");

    const data = (await response.json()).data;
    console.log(data.token);
    
    return {
      user: data.user,
      token: data.token as { accessToken: string; refreshToken: string },
    };
  } catch (e: any) {
    throw new Error(e?.message || "Erreur de connexion");
  }
};

// --- logOut() ---
export const logOut = async (accessToken?: string) => {
  try {
    await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: accessToken
        ? { "Authorization": `Bearer ${accessToken}` }
        : undefined,
    });
  } catch (e: any) {
    throw new Error(e?.message || "Erreur de connexion");
  }
};

// --- update() : met à jour l'utilisateur ---
export const update = async (
  id: string,
  username: string,
  email: string,
  accessToken: string
) => {
  try {
    const response = await fetch(`${baseUrl}/update_user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, // 🔑 token obligatoire
      },
      body: JSON.stringify({ username, email, role: "farmer" }),
    });

    if (!response.ok) throw new Error("Invalid credentials");

    const data = await response.json();
    return data.user;
  } catch (e: any) {
    throw new Error(e?.message || "Erreur de connexion");
  }
};
