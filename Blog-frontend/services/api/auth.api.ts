import { baseUrl } from ".";

export const me = async () => {
    try{
        const res = await fetch(baseUrl+"/me", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            return null;
        }
        return await res.json();
    }
    catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const logIn = async (email:string, password:string) => {
    try {      
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();

      return data.user;

    }catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const register = async (username:string, email:string, password:string) => {
    try {
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password: password, role: "farmer" }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      return data.user;

    } catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const logOut = async () => {
    try{
      await fetch(`${baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    }catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const update = async (id:string, username:string, email:string) => {
    try{
      const response = await fetch(`${baseUrl}/update_user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, role: "farmer" }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      return data.user;
      
    }catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}