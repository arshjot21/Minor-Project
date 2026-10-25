const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db/database');
const { authenticateToken, optionalAuth, requireAdmin, JWT_SECRET } = require('./middleware/auth');
const { getRecommendationsForUser } = require('./services/recommendation');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/register', (req, res) => {
  const { name, username, email, password, interests } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields (name, username, email, password) are required.' });
  }

  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const profile_image = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600`;
    
    const stmt = db.prepare(`
      INSERT INTO users (name, username, email, password_hash, profile_image, bio, role)
      VALUES (?, ?, ?, ?, ?, ?, 'user')
    `);
    const info = stmt.run(name, username, email, password_hash, profile_image, 'Fashion enthusiast');
    const userId = info.lastInsertRowid;

    // Save initial interests if provided
    if (Array.isArray(interests)) {
      const intStmt = db.prepare('INSERT INTO user_interests (user_id, category_name) VALUES (?, ?)');
      interests.forEach(cat => intStmt.run(userId, cat));
    }

    const token = jwt.sign({ id: userId, username, email, role: 'user', name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: userId, name, username, email, role: 'user', profile_image, bio: 'Fashion enthusiast', interests: interests || [] }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const interests = db.prepare('SELECT category_name FROM user_interests WHERE user_id = ?').all(user.id).map(i => i.category_name);

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
        bio: user.bio,
        interests
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, username, email, role, profile_image, bio, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const interests = db.prepare('SELECT category_name FROM user_interests WHERE user_id = ?').all(user.id).map(i => i.category_name);
    
    // Get user stats
    const bookmarkCount = db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ?').get(user.id).count;
    const likeCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE user_id = ?').get(user.id).count;

    res.json({
      user: { ...user, interests, bookmarkCount, likeCount }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
  const { name, bio, profile_image, interests } = req.body;

  try {
    db.prepare('UPDATE users SET name = ?, bio = ?, profile_image = ? WHERE id = ?').run(
      name || req.user.name,
      bio || '',
      profile_image || '',
      req.user.id
    );

    if (Array.isArray(interests)) {
      db.prepare('DELETE FROM user_interests WHERE user_id = ?').run(req.user.id);
      const intStmt = db.prepare('INSERT INTO user_interests (user_id, category_name) VALUES (?, ?)');
      interests.forEach(cat => intStmt.run(req.user.id, cat));
    }

    const updatedUser = db.prepare('SELECT id, name, username, email, role, profile_image, bio FROM users WHERE id = ?').get(req.user.id);
    const updatedInterests = db.prepare('SELECT category_name FROM user_interests WHERE user_id = ?').all(req.user.id).map(i => i.category_name);

    res.json({
      user: { ...updatedUser, interests: updatedInterests },
      message: 'Profile updated successfully.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ==========================================
// ARTICLES ENDPOINTS
// ==========================================

app.get('/api/articles', optionalAuth, (req, res) => {
  const { category, search, featured, status = 'published', limit = 50 } = req.query;

  try {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'All') {
      query += ' AND LOWER(category_name) = LOWER(?)';
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }

    if (search) {
      query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY published_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const articles = db.prepare(query).all(...params);

    // If user is authenticated, attach user's bookmarked & liked states
    if (req.user) {
      const userBookmarks = new Set(
        db.prepare("SELECT item_id FROM bookmarks WHERE user_id = ? AND item_type = 'article'").all(req.user.id).map(b => b.item_id)
      );
      const userLikes = new Set(
        db.prepare("SELECT article_id FROM likes WHERE user_id = ?").all(req.user.id).map(l => l.article_id)
      );

      articles.forEach(a => {
        a.isBookmarked = userBookmarks.has(a.id);
        a.isLiked = userLikes.has(a.id);
      });
    }

    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to fetch articles.' });
  }
});

app.get('/api/articles/:slug', optionalAuth, (req, res) => {
  const { slug } = req.params;

  try {
    const article = db.prepare('SELECT * FROM articles WHERE slug = ? OR id = ?').get(slug, slug);

    if (!article) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    // Increment view count
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(article.id);
    article.views += 1;

    // Track user reading history if logged in
    if (req.user) {
      db.prepare('INSERT INTO reading_history (user_id, article_id) VALUES (?, ?)').run(req.user.id, article.id);
    }

    // Get like count
    const likeCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE article_id = ?').get(article.id).count;
    article.likeCount = likeCount;

    // Check user liked and bookmarked status
    article.isLiked = false;
    article.isBookmarked = false;

    if (req.user) {
      const liked = db.prepare('SELECT id FROM likes WHERE user_id = ? AND article_id = ?').get(req.user.id, article.id);
      const bookmarked = db.prepare("SELECT id FROM bookmarks WHERE user_id = ? AND item_type = 'article' AND item_id = ?").get(req.user.id, article.id);
      article.isLiked = !!liked;
      article.isBookmarked = !!bookmarked;
    }

    // Get related articles in same category
    const related = db.prepare('SELECT * FROM articles WHERE category_name = ? AND id != ? LIMIT 3').all(article.category_name, article.id);

    res.json({ article, related });
  } catch (err) {
    console.error('Error fetching article detail:', err);
    res.status(500).json({ error: 'Failed to fetch article detail.' });
  }
});

app.post('/api/articles', authenticateToken, requireAdmin, (req, res) => {
  const { title, slug, excerpt, content, cover_image, category_name, read_time, status, is_featured } = req.body;

  if (!title || !content || !cover_image || !category_name) {
    return res.status(400).json({ error: 'Title, content, cover image, and category are required.' });
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const stmt = db.prepare(`
      INSERT INTO articles (title, slug, excerpt, content, cover_image, category_name, author_id, author_name, author_image, read_time, status, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      generatedSlug,
      excerpt || title,
      content,
      cover_image,
      category_name,
      req.user.id,
      req.user.name || 'Victoria Vance',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      read_time || '5 min read',
      status || 'published',
      is_featured ? 1 : 0
    );

    const newArticle = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newArticle);
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ error: 'Failed to create article.' });
  }
});

app.put('/api/articles/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, cover_image, category_name, read_time, status, is_featured } = req.body;

  try {
    db.prepare(`
      UPDATE articles 
      SET title = ?, excerpt = ?, content = ?, cover_image = ?, category_name = ?, read_time = ?, status = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, excerpt, content, cover_image, category_name, read_time, status, is_featured ? 1 : 0, id);

    const updated = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update article.' });
  }
});

app.delete('/api/articles/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article.' });
  }
});

// ==========================================
// TRENDS ENDPOINTS
// ==========================================

app.get('/api/trends', optionalAuth, (req, res) => {
  try {
    const trends = db.prepare('SELECT * FROM trends ORDER BY popularity_score DESC').all();

    if (req.user) {
      const userBookmarks = new Set(
        db.prepare("SELECT item_id FROM bookmarks WHERE user_id = ? AND item_type = 'trend'").all(req.user.id).map(b => b.item_id)
      );
      trends.forEach(t => t.isBookmarked = userBookmarks.has(t.id));
    }

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trends.' });
  }
});

app.get('/api/trends/:slug', optionalAuth, (req, res) => {
  try {
    const trend = db.prepare('SELECT * FROM trends WHERE slug = ? OR id = ?').get(req.params.slug, req.params.slug);
    if (!trend) {
      return res.status(404).json({ error: 'Trend not found.' });
    }

    const relatedArticles = db.prepare('SELECT * FROM articles WHERE category_name = ? OR title LIKE ? LIMIT 4')
      .all(trend.category_name, `%${trend.name}%`);

    res.json({ trend, relatedArticles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trend detail.' });
  }
});

// ==========================================
// DESIGNERS ENDPOINTS
// ==========================================

app.get('/api/designers', optionalAuth, (req, res) => {
  const { category } = req.query;
  try {
    let query = 'SELECT * FROM designers';
    const params = [];

    if (category && category !== 'All') {
      query += ' WHERE category_type = ?';
      params.push(category);
    }
    query += ' ORDER BY name ASC';

    const designers = db.prepare(query).all(...params);

    if (req.user) {
      const userBookmarks = new Set(
        db.prepare("SELECT item_id FROM bookmarks WHERE user_id = ? AND item_type = 'designer'").all(req.user.id).map(b => b.item_id)
      );
      designers.forEach(d => d.isBookmarked = userBookmarks.has(d.id));
    }

    res.json(designers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch designers.' });
  }
});

app.get('/api/designers/:id', optionalAuth, (req, res) => {
  try {
    const designer = db.prepare('SELECT * FROM designers WHERE id = ? OR slug = ?').get(req.params.id, req.params.id);
    if (!designer) {
      return res.status(404).json({ error: 'Designer not found.' });
    }

    const collections = db.prepare('SELECT * FROM collections WHERE designer_id = ? ORDER BY year DESC').all(designer.id);
    const relatedArticles = db.prepare('SELECT * FROM articles WHERE content LIKE ? OR title LIKE ? LIMIT 4').all(`%${designer.name}%`, `%${designer.name}%`);

    res.json({ designer, collections, relatedArticles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch designer detail.' });
  }
});

// ==========================================
// COLLECTIONS ENDPOINTS
// ==========================================

app.get('/api/collections', optionalAuth, (req, res) => {
  const { season, category } = req.query;
  try {
    let query = 'SELECT * FROM collections WHERE 1=1';
    const params = [];

    if (season && season !== 'All') {
      query += ' AND season = ?';
      params.push(season);
    }

    if (category && category !== 'All') {
      query += ' AND category_type = ?';
      params.push(category);
    }

    query += ' ORDER BY year DESC, id DESC';
    const collections = db.prepare(query).all(...params);

    if (req.user) {
      const userBookmarks = new Set(
        db.prepare("SELECT item_id FROM bookmarks WHERE user_id = ? AND item_type = 'collection'").all(req.user.id).map(b => b.item_id)
      );
      collections.forEach(c => c.isBookmarked = userBookmarks.has(c.id));
    }

    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collections.' });
  }
});

// ==========================================
// STREET STYLE ENDPOINTS
// ==========================================

app.get('/api/street-style', optionalAuth, (req, res) => {
  const { tag, category } = req.query;
  try {
    let query = 'SELECT * FROM street_style WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND outfit_category = ?';
      params.push(category);
    }

    if (tag) {
      query += ' AND style_tags LIKE ?';
      params.push(`%${tag}%`);
    }

    query += ' ORDER BY saved_count DESC, id DESC';
    const items = db.prepare(query).all(...params);

    if (req.user) {
      const userBookmarks = new Set(
        db.prepare("SELECT item_id FROM bookmarks WHERE user_id = ? AND item_type = 'street_style'").all(req.user.id).map(b => b.item_id)
      );
      items.forEach(i => i.isBookmarked = userBookmarks.has(i.id));
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch street style lookbook.' });
  }
});

// ==========================================
// BOOKMARKS & LIKES ENDPOINTS
// ==========================================

app.get('/api/bookmarks', authenticateToken, (req, res) => {
  try {
    const rawBookmarks = db.prepare('SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    
    const articles = [];
    const trends = [];
    const designers = [];
    const collections = [];
    const streetStyles = [];

    rawBookmarks.forEach(b => {
      if (b.item_type === 'article') {
        const item = db.prepare('SELECT * FROM articles WHERE id = ?').get(b.item_id);
        if (item) articles.push(item);
      } else if (b.item_type === 'trend') {
        const item = db.prepare('SELECT * FROM trends WHERE id = ?').get(b.item_id);
        if (item) trends.push(item);
      } else if (b.item_type === 'designer') {
        const item = db.prepare('SELECT * FROM designers WHERE id = ?').get(b.item_id);
        if (item) designers.push(item);
      } else if (b.item_type === 'collection') {
        const item = db.prepare('SELECT * FROM collections WHERE id = ?').get(b.item_id);
        if (item) collections.push(item);
      } else if (b.item_type === 'street_style') {
        const item = db.prepare('SELECT * FROM street_style WHERE id = ?').get(b.item_id);
        if (item) streetStyles.push(item);
      }
    });

    res.json({ articles, trends, designers, collections, streetStyles, totalCount: rawBookmarks.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user bookmarks.' });
  }
});

app.post('/api/bookmarks', authenticateToken, (req, res) => {
  const { item_type, item_id } = req.body;

  if (!item_type || !item_id) {
    return res.status(400).json({ error: 'item_type and item_id are required.' });
  }

  try {
    const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?').get(req.user.id, item_type, item_id);

    if (existing) {
      // Remove bookmark toggle
      db.prepare('DELETE FROM bookmarks WHERE id = ?').run(existing.id);
      return res.json({ bookmarked: false, message: 'Removed from saved library.' });
    } else {
      // Add bookmark
      db.prepare('INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (?, ?, ?)').run(req.user.id, item_type, item_id);
      return res.json({ bookmarked: true, message: 'Saved to library.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bookmark.' });
  }
});

app.post('/api/articles/:id/like', authenticateToken, (req, res) => {
  const articleId = req.params.id;

  try {
    const existing = db.prepare('SELECT id FROM likes WHERE user_id = ? AND article_id = ?').get(req.user.id, articleId);

    if (existing) {
      db.prepare('DELETE FROM likes WHERE id = ?').run(existing.id);
    } else {
      db.prepare('INSERT INTO likes (user_id, article_id) VALUES (?, ?)').run(req.user.id, articleId);
    }

    const likeCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE article_id = ?').get(articleId).count;
    res.json({ liked: !existing, likeCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle like.' });
  }
});

// ==========================================
// COMMENTS ENDPOINTS
// ==========================================

app.get('/api/articles/:id/comments', (req, res) => {
  try {
    const comments = db.prepare('SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC').all(req.params.id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});

app.post('/api/articles/:id/comments', authenticateToken, (req, res) => {
  const { content } = req.body;
  const articleId = req.params.id;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content cannot be empty.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO comments (user_id, user_name, user_image, article_id, content)
      VALUES (?, ?, ?, ?, ?)
    `);

    const user = db.prepare('SELECT name, profile_image FROM users WHERE id = ?').get(req.user.id);

    const result = stmt.run(
      req.user.id,
      user ? user.name : req.user.name,
      user ? user.profile_image : '',
      articleId,
      content.trim()
    );

    const newComment = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post comment.' });
  }
});

app.delete('/api/comments/:id', authenticateToken, (req, res) => {
  try {
    const comment = db.prepare('SELECT user_id FROM comments WHERE id = ?').get(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this comment.' });
    }

    db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
    res.json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment.' });
  }
});

// ==========================================
// RECOMMENDATIONS ENDPOINT
// ==========================================

app.get('/api/recommendations', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const recommendations = getRecommendationsForUser(userId, 6);
    res.json(recommendations);
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

// ==========================================
// SEARCH ENDPOINT
// ==========================================

app.get('/api/search', (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.json({ articles: [], trends: [], designers: [], collections: [] });
  }

  const queryTerm = `%${q.trim()}%`;

  try {
    const articles = db.prepare('SELECT * FROM articles WHERE title LIKE ? OR excerpt LIKE ? OR category_name LIKE ? LIMIT 6')
      .all(queryTerm, queryTerm, queryTerm);

    const trends = db.prepare('SELECT * FROM trends WHERE name LIKE ? OR description LIKE ? LIMIT 6')
      .all(queryTerm, queryTerm);

    const designers = db.prepare('SELECT * FROM designers WHERE name LIKE ? OR design_style LIKE ? LIMIT 6')
      .all(queryTerm, queryTerm);

    const collections = db.prepare('SELECT * FROM collections WHERE name LIKE ? OR designer_name LIKE ? LIMIT 6')
      .all(queryTerm, queryTerm);

    res.json({ articles, trends, designers, collections });
  } catch (err) {
    res.status(500).json({ error: 'Search failed.' });
  }
});

// ==========================================
// NEWSLETTER ENDPOINT
// ==========================================

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  try {
    db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)').run(email);
    res.json({ message: 'Thank you for subscribing to FD Trend!' });
  } catch (err) {
    res.status(500).json({ error: 'Subscription failed.' });
  }
});

// ==========================================
// ADMIN METRICS ENDPOINT
// ==========================================

app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;
    const totalViews = db.prepare('SELECT SUM(views) as count FROM articles').get().count || 0;
    const totalSubscribers = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers').get().count;

    const topArticles = db.prepare('SELECT id, title, views, category_name FROM articles ORDER BY views DESC LIMIT 5').all();

    res.json({
      totalUsers,
      totalArticles,
      totalViews,
      totalSubscribers,
      topArticles
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

app.listen(PORT, () => {
  console.log(`FD Trend Server is running on port ${PORT}`);
});
