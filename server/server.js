const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase } = require('../src/config/database');
const Post = require('../src/models/Post');
const slugify = require('slugify');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();


app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});


app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    let slug = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
    
    let uniqueSlug = slug;
    let counter = 1;
    
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    const post = new Post({
      title,
      content,
      slug: uniqueSlug,
    });
    
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const updateData = {
      title,
      content,
      updatedAt: new Date(),
    };
    
    
    const existingPost = await Post.findOne({ slug });
    if (existingPost && existingPost.title !== title) {
      const newSlug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
      
      if (newSlug !== slug) {
        let uniqueSlug = newSlug;
        let counter = 1;
        
        while (await Post.findOne({ slug: uniqueSlug })) {
          uniqueSlug = `${newSlug}-${counter}`;
          counter++;
        }
        
        updateData.slug = uniqueSlug;
      }
    }
    
    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      updateData,
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});
app.delete('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedPost = await Post.findOneAndDelete({ slug });
    
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});