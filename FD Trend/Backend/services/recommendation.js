const db = require('../db/database');

/**
 * Calculates a content-based recommendation score for articles based on a user's activity:
 * - User selected interest tags
 * - Liked articles categories
 * - Bookmarked articles categories
 * - Followed designers
 * - Previously viewed categories
 * - Article popularity (views count)
 */
function getRecommendationsForUser(userId, limit = 6) {
  let userCategories = new Set();
  let userDesigners = new Set();

  if (userId) {
    // 1. Get user interest tags
    const interests = db.prepare('SELECT category_name FROM user_interests WHERE user_id = ?').all(userId);
    interests.forEach(i => userCategories.add(i.category_name.toLowerCase()));

    // 2. Get categories from liked articles
    const likedCats = db.prepare(`
      SELECT DISTINCT a.category_name 
      FROM likes l 
      JOIN articles a ON l.article_id = a.id 
      WHERE l.user_id = ?
    `).all(userId);
    likedCats.forEach(c => userCategories.add(c.category_name.toLowerCase()));

    // 3. Get categories from bookmarked articles
    const bookmarkedCats = db.prepare(`
      SELECT DISTINCT a.category_name 
      FROM bookmarks b 
      JOIN articles a ON b.item_id = a.id 
      WHERE b.user_id = ? AND b.item_type = 'article'
    `).all(userId);
    bookmarkedCats.forEach(c => userCategories.add(c.category_name.toLowerCase()));

    // 4. Get followed designers
    const designers = db.prepare('SELECT designer_id FROM followed_designers WHERE user_id = ?').all(userId);
    designers.forEach(d => userDesigners.add(d.designer_id));
  }

  // Fetch all published articles
  const articles = db.prepare('SELECT * FROM articles WHERE status = ? ORDER BY published_at DESC').all('published');

  // Compute score for each article
  const scoredArticles = articles.map(art => {
    let score = 0;

    // Category match weight (40 pts)
    if (userCategories.has(art.category_name.toLowerCase())) {
      score += 40;
    }

    // Popularity score weight (up to 30 pts)
    const viewScore = Math.min((art.views || 0) / 50, 30);
    score += viewScore;

    // Featured weight (15 pts)
    if (art.is_featured) {
      score += 15;
    }

    // Recency weight (15 pts for last 30 days)
    const pubDate = new Date(art.published_at);
    const now = new Date();
    const daysDiff = (now - pubDate) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 30) {
      score += Math.max(0, 15 - daysDiff);
    }

    return {
      ...art,
      recommendation_score: Math.round(score)
    };
  });

  // Sort by score descending
  scoredArticles.sort((a, b) => b.recommendation_score - a.recommendation_score);

  return scoredArticles.slice(0, limit);
}

module.exports = {
  getRecommendationsForUser
};
