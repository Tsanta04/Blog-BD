import { Ground } from "@/src/utils/types";
import { baseUrl } from ".";

export const getCultureTypes = async() => {
    try{
      const response = await fetch(`${baseUrl}/culture_types`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch crop types');
      const data  = await response.json();
      
      return data;

    } catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const create = async(newGround: Partial<Ground>) => {
    try{
      const response = await fetch(`${baseUrl}/ground`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGround),
      });

      if (!response.ok) throw new Error('Failed to create ground');
      const data = await response.json();

      return { ...newGround, ...data };

    } catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const update = async(id:number,updatePayload: Partial<Ground>) => {
    try{
      const response = await fetch(`${baseUrl}/ground/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) throw new Error('Failed to update ground');

      return true;

    } catch(e: any){
        throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
}

export const me = async (id:string) => {
    try{
        const res = await fetch(baseUrl+"/ground_user/"+id, {
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