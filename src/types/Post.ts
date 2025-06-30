export interface Post {
  _id?: string;
  title: string;
  content: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title: string;
  content: string;
  slug?: string;
}