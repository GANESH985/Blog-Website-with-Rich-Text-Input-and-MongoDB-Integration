import { connectToDatabase } from '../lib/mongodb';
import Post from '../models/Post';
import slugify from 'slugify';
import { CreatePostData, UpdatePostData } from '../types/Post';

export class PostService {
  static async createPost(data: CreatePostData) {
    await connectToDatabase();
    
    const slug = slugify(data.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = new Post({
      title: data.title,
      content: data.content,
      slug: uniqueSlug,
    });

    return await post.save();
  }

  static async getAllPosts() {
    await connectToDatabase();
    return await Post.find({}).sort({ createdAt: -1 });
  }

  static async getPostBySlug(slug: string) {
    await connectToDatabase();
    return await Post.findOne({ slug });
  }

  static async updatePost(slug: string, data: UpdatePostData) {
    await connectToDatabase();
    
    const updateData: any = {
      title: data.title,
      content: data.content,
      updatedAt: new Date(),
    };

    // If title changed, generate new slug
    if (data.slug) {
      const newSlug = slugify(data.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
      
      if (newSlug !== slug) {
        updateData.slug = newSlug;
      }
    }

    return await Post.findOneAndUpdate({ slug }, updateData, { new: true });
  }

  static async deletePost(slug: string) {
    await connectToDatabase();
    return await Post.findOneAndDelete({ slug });
  }
}