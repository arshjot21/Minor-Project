const API_BASE = '/api';

function getHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    return json;
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch user profile');
    return json;
  },

  async updateProfile(data, token) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update profile');
    return json;
  },

  // Articles
  async getArticles(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/articles?${query}`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch articles');
    return json;
  },

  async getArticleBySlug(slug, token) {
    const res = await fetch(`${API_BASE}/articles/${slug}`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch article detail');
    return json;
  },

  async createArticle(data, token) {
    const res = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create article');
    return json;
  },

  async updateArticle(id, data, token) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update article');
    return json;
  },

  async deleteArticle(id, token) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete article');
    return json;
  },

  // Trends
  async getTrends(token) {
    const res = await fetch(`${API_BASE}/trends`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch trends');
    return json;
  },

  async getTrendBySlug(slug, token) {
    const res = await fetch(`${API_BASE}/trends/${slug}`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch trend detail');
    return json;
  },

  // Designers
  async getDesigners(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/designers?${query}`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch designers');
    return json;
  },

  async getDesignerById(id, token) {
    const res = await fetch(`${API_BASE}/designers/${id}`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch designer detail');
    return json;
  },

  // Collections
  async getCollections(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/collections?${query}`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch collections');
    return json;
  },

  // Street Style
  async getStreetStyle(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/street-style?${query}`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch street style');
    return json;
  },

  // Bookmarks
  async getBookmarks(token) {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch bookmarks');
    return json;
  },

  async toggleBookmark(itemType, itemId, token) {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ item_type: itemType, item_id: itemId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to toggle bookmark');
    return json;
  },

  // Likes
  async toggleLike(articleId, token) {
    const res = await fetch(`${API_BASE}/articles/${articleId}/like`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to toggle like');
    return json;
  },

  // Comments
  async getComments(articleId) {
    const res = await fetch(`${API_BASE}/articles/${articleId}/comments`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch comments');
    return json;
  },

  async postComment(articleId, content, token) {
    const res = await fetch(`${API_BASE}/articles/${articleId}/comments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ content })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to post comment');
    return json;
  },

  async deleteComment(commentId, token) {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete comment');
    return json;
  },

  // Recommendations
  async getRecommendations(token) {
    const res = await fetch(`${API_BASE}/recommendations`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch recommendations');
    return json;
  },

  // Search
  async search(query) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Search failed');
    return json;
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Subscription failed');
    return json;
  },

  // Admin
  async getAdminStats(token) {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(token)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch admin stats');
    return json;
  }
};
