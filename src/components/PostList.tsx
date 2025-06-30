import React from 'react';
import { Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Post } from '../types/Post';

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onView: (post: Post) => void;
  isLoading?: boolean;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Edit size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
        <p className="text-gray-500">Create your first blog post to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar size={14} className="mr-1" />
                {new Date(post.createdAt || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div
                className="text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                /blog/{post.slug}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onView(post)}
                className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye size={16} />
                View
              </button>
              <button
                onClick={() => onEdit(post)}
                className="flex items-center gap-1 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => onDelete(post)}
                className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};