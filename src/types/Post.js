// Post type definitions for JavaScript
export const PostTypes = {
  Post: {
    _id: String,
    title: String,
    content: String,
    slug: String,
    createdAt: Date,
    updatedAt: Date,
  },
  
  CreatePostData: {
    title: String,
    content: String,
  },
  
  UpdatePostData: {
    title: String,
    content: String,
    slug: String,
  }
};