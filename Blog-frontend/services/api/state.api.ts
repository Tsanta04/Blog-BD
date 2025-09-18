import { baseUrl } from ".";

export const getStatistic = async (id:number) =>{
    try {

      const response = await fetch(`${baseUrl}/ground/stat/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      return data;

    } catch (error: any) {
      console.error("Sign up failed:", error);
      throw error;
    }
}
