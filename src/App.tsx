import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogHome } from './components/BlogHome';
import { BlogPost } from './components/BlogPost';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BlogHome />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/404" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Post not found</p>
                <a href="/" className="text-blue-600 hover:text-blue-700">
                  Go back home
                </a>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;