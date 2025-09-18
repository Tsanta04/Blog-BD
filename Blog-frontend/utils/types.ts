export interface User {
  user_id:string,
  username: string;
  email: string;
  postsCount?:number,
  likesCount?:number,
  commentsCount?:number
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export type LocationType = {
  id?:number;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface Ground {
  id?: number;
  name: string;
  description: string;
  cover_photo?: string;
  culture_type_id?: number;
  culture_type?: cropType,
  location_id?:number,
  location?: LocationType;
  user_id: string;
  qr_code?: string;
  sensor_pack_id?: string;
}

export interface GroundState {
  temperature: number;
  health: number;
  production_progress: number;
  humidity: number;
  fertility: number;
  rentability: number;
  date: string;
}

export interface cropType {
  id?: number,
  type_:string
}

export interface Planning {
  id?: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: 'pending' | 'in-progress' | 'completed';
  ground_id?:number;
}

export interface GroundStatType {
  temperature: number[],
  health: number[],
  humidity: number[],
  fertility: number[],
  productivity: number[],
  rentability: number[],  
}

export interface NotificationState {
  temperature: number;
  health: number;
  production_progress: number;
  humidity: number;
  fertility: number;
  rentability: number;
}

export interface Notification {
  id: number;
  date: string;
  title: string;
  description: string;
  type: string;
  level: string; // "low" | "medium" | "high" | "critical"
  recommandation: string;
  is_seen: boolean;
  state_id: number;
  ground_id: number;
  state?: NotificationState;
}

export interface Message {
  id?: string;
  userId: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ApiMessage {
  id: number;
  sender_id: string | null;
  content: string;
  date: string | null;
  receiver_id: string | null;
}
