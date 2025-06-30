import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import PostList from './PostList';
import PostForm from './PostForm';
import { PostService } from '../services/postService';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit'
  const [selectedPost, setSelectedPost] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await PostService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (data) => {
    setIsSubmitting(true);
    try {
      await PostService.createPost(data);
      await loadPosts();
      setViewMode('list');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (data) => {
    if (!selectedPost) return;
    
    setIsSubmitting(true);
    try {
      await PostService.updatePost(selectedPost.slug, data);
      await loadPosts();
      setViewMode('list');
      setSelectedPost(undefined);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    try {
      await PostService.deletePost(post.slug);
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setViewMode('edit');
  };

  const handleViewPost = (post) => {
    window.open(`/blog/${post.slug}`, '_blank');
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedPost(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Blog Admin</h1>
            </div>
            {viewMode === 'list' && (
              <button
                onClick={() => setViewMode('create')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                New Post
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'list' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Posts</h2>
              <p className="text-gray-600">Manage your blog posts</p>
            </div>
            <PostList
              posts={posts}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onView={handleViewPost}
              isLoading={isLoading}
            />
          </div>
        )}

        {viewMode === 'create' && (
          <PostForm
            onSubmit={handleCreatePost}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}

        {viewMode === 'edit' && selectedPost && (
          <PostForm
            post={selectedPost}
            onSubmit={handleUpdatePost}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

export { AdminDashboard }