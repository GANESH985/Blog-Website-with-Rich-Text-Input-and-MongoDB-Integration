import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { PostService } from '../services/postService';
import DOMPurify from 'dompurify';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      setIsLoading(true);
      try {
        const data = await PostService.getPostBySlug(slug);
        if (data) {
          setPost(data);
          // Update document title and meta tags
          document.title = `${data.title} - Blog`;
          updateMetaTags(data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const updateMetaTags = (post) => {
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') || 
                          document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    const textContent = post.content.replace(/<[^>]*>/g, '').substring(0, 160);
    metaDescription.setAttribute('content', textContent);
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || 
                   document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', post.title);
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') || 
                         document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', textContent);
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }
  };

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 md:p-12">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-500">
                <Calendar size={16} className="mr-2" />
                <time dateTime={post.createdAt?.toString()}>
                  {new Date(post.createdAt || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </header>

            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;

export { BlogPost }