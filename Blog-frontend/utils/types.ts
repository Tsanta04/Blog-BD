export interface User {
  id?:string,
  name: string;
  email: string;
  posts?: Post[],
  postsCount?:number,
  likes?: User[],
  likesCount?:number,
  followers?: User[],
  isLiked?:boolean,
  isFollowed?:boolean,
  followersCount?:number
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface Post {
  id?: number,
  title: string,
  content: string,
  user_id: string,
  user?: User,
  tags?: Tags[],
  medias?: Medias[],
  comments?: Comments[],
  commentsCount?:number,
  likes?: User[],
  likesCount?: number,
  views?: User[],
  viewsCount?:number,
  createdAt: string,
}

export interface Tags {
  id?: number,
  tags: string
}

export interface Type_medias {
  id?:number,
  type_: string
}

export interface Medias {
  id?: number,
  path_name: string,
  type_id: number,
  type_: Type_medias
}

export interface Comments {
  id?: number,
  content: string,
  post_id: number,
  user_id: string,
  user?: User,
  post?: Post,
  createdAt: string,
}

export interface Likes_posts {
  user_id: string,
  post_id: number,  
}

export interface Likes_users {
  user_id: string,
  liker_id: string,  
}

export interface Follower_user {
  user_id: string,
  follower_id: string,  
}

export interface Stat {
  day:string;
  num:number;
}