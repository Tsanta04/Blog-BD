import { FormatNaiveDateTime } from "@/src/utils/FormatDate";
import { baseUrl } from ".";
import { Planning } from "../../utils/types";

export const get = async () =>{
    try {

      const response = await fetch(`${baseUrl}/planning`, {
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

export const create = async (planningData: Planning) => {
    // Try real API first, fallback to mock
    try {
      console.log(planningData);
      const response = await fetch(`${baseUrl}/planning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...planningData,
          start_date: FormatNaiveDateTime(new Date(planningData.start_date)),
          end_date: FormatNaiveDateTime(new Date(planningData.end_date)),
        }),
      });
              // console.log(response);        
      if (response.ok) {
          return true;
      } else {
        throw new Error('Failed to save ground');
      }
    } catch (error) {
      throw error;
    }
};

export const update = async (id: number, planningData: Partial<Planning>) => {
    try {
      const val = {
          ...planningData,
          ...(planningData.start_date ? { start_date: FormatNaiveDateTime(new Date(planningData.start_date)) } : {}),
          ...(planningData.end_date ? { end_date: FormatNaiveDateTime(new Date(planningData.end_date)) } : {}),
        };
      const response = await fetch(`${baseUrl}/planning/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(val)
      });
      console.log(response);
      
      if (response.ok) {
          return true;
      } else {
        throw new Error('Failed to update ground');
      }
    } catch (error) {
      console.log(error);
      
      throw error;
    }
};