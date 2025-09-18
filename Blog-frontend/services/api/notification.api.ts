// src/services/api/notification.api.ts
import { baseUrl } from '.';
import { Notification } from '../../utils/types';

export const get = async (groundId: number): Promise<Notification[] | null> => {
  try {
    const res = await fetch(`${baseUrl}/alerts?ground_id=${groundId}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const dt = await res.json();
    console.log(groundId);    
    return dt;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getOne = async (id: number): Promise<Notification | null> => {
  try {
    const res = await fetch(`${baseUrl}/alerts/${id}`);
    console.log(res);
    
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const dt = await res.json();
    return dt;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const create = async (notifData: Partial<Notification>): Promise<Notification | null> => {
  try {
    const res = await fetch(`${baseUrl}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notifData),
    });
    if (!res.ok) throw new Error('Failed to create notification');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const update = async (id: number, notifData: Partial<Notification>): Promise<Notification | null> => {
  try {
    const res = await fetch(`${baseUrl}/alerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notifData),
    });
    if (!res.ok) throw new Error('Failed to update notification');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
