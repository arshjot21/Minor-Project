// FD Trend Blog - Application Core Script (Single Page App Engine)
import {
  INITIAL_ARTICLES,
  CATEGORIES,
  WEEKLY_TRENDS,
  FEATURED_INFLUENCERS,
  POPULAR_BRANDS,
  TESTIMONIALS,
  INSTAGRAM_POSTS,
  INITIAL_COMMENTS,
  DEVELOPER_PROFILE
} from './mockData.js';

// Global State
const state = {
  articles: JSON.parse(localStorage.getItem('fd_articles')) || INITIAL_ARTICLES,
  comments: JSON.parse(localStorage.getItem('fd_comments')) || INITIAL_COMMENTS,
  savedArticles: JSON.parse(localStorage.getItem('fd_saved')) || ['art-1', 'art-5'],
  likedArticles: JSON.parse(localStorage.getItem('fd_likes')) || ['art-1', 'art-3'],
  user: JSON.parse(localStorage.getItem('fd_user')) || {
    name: 'Arshjot Kaur Deol',
    email: 'arshjot@student.bca.edu',
    role: 'user', // 'user' or 'admin'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Fashion tech enthusiast and BCA student developer.'
  },
  theme: localStorage.getItem('fd_theme') || 'light',
  currentPage: 'home', // home, blog, article-detail, categories, about, contact, user-dashboard, admin-dashboard
  selectedArticleId: 'art-1',
  selectedCategory: 'All',
  searchQuery: '',
  sortBy: 'latest',
  blogPage: 1,
  articlesPerPage: 6,
  authModalOpen: false,
  authMode: 'login', // login or register
  adminModalOpen: false,
  editingArticleId: null
};

// SVG Icon Helper
function getIcon(name, size = 20, className = '') {
  const icons = {
    search: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
    sun: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    moon: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`,
    user: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    bookmark: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`,
    heart: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"/></svg>`,
    share: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>`,
    arrowRight: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
    menu: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    close: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    sparkles: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
    shirt: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l6-3 3 3 3-3 6 3v13H3V7z"/></svg>`,
    crown: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    leaf: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`,
    lightbulb: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
    trash: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
    edit: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
    plus: `<svg width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>`
  };
  return icons[name] || '';
}

// Show Toast Notification
function showToast(message, type = 'gold') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--gold-primary);">${getIcon('sparkles', 18)}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Persistence Utilities
function saveArticles() {
  localStorage.setItem('fd_articles', JSON.stringify(state.articles));
}
function saveComments() {
  localStorage.setItem('fd_comments', JSON.stringify(state.comments));
}
function saveUserData() {
  localStorage.setItem('fd_saved', JSON.stringify(state.savedArticles));
  localStorage.setItem('fd_likes', JSON.stringify(state.likedArticles));
  localStorage.setItem('fd_user', JSON.stringify(state.user));
}

// Theme Manager
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('fd_theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
  renderApp();
  showToast(`Switched to ${state.theme === 'dark' ? 'Dark' : 'Light'} Mode`);
}

// Navigation & Routing
function navigateTo(page, params = {}) {
  state.currentPage = page;
  if (params.articleId) state.selectedArticleId = params.articleId;
  if (params.category) state.selectedCategory = params.category;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

// Like / Bookmark Action Handlers
function toggleLike(articleId, e) {
  if (e) e.stopPropagation();
  const idx = state.likedArticles.indexOf(articleId);
  const article = state.articles.find(a => a.id === articleId);
  
  if (idx > -1) {
    state.likedArticles.splice(idx, 1);
    if (article) article.likes = Math.max(0, article.likes - 1);
    showToast('Removed from liked posts');
  } else {
    state.likedArticles.push(articleId);
    if (article) article.likes += 1;
    showToast('Added to liked posts!');
  }
  saveArticles();
  saveUserData();
  renderApp();
}

function toggleBookmark(articleId, e) {
  if (e) e.stopPropagation();
  const idx = state.savedArticles.indexOf(articleId);
  
  if (idx > -1) {
    state.savedArticles.splice(idx, 1);
    showToast('Removed from saved articles');
  } else {
    state.savedArticles.push(articleId);
    showToast('Article saved to your dashboard!');
  }
  saveUserData();
  renderApp();
}

// Render Header & Navigation
function renderHeader() {
  const isDark = state.theme === 'dark';
  const savedCount = state.savedArticles.length;
  
  return `
    <header class="header-glass">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between; height: 80px;">
        
        <!-- Brand Logo -->
        <a href="#" onclick="window.navTo('home'); return false;" style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: var(--gold-gradient); display: flex; align-items: center; justify-content: center; color: #FFF; font-family: var(--font-serif); font-weight: 700; font-size: 1.4rem; box-shadow: 0 4px 14px rgba(212,175,55,0.35);">
            FD
          </div>
          <div>
            <div style="font-family: var(--font-serif); font-weight: 700; font-size: 1.3rem; letter-spacing: -0.02em; line-height: 1.1;">FD TREND</div>
            <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--gold-primary); font-weight: 600;">Fashion Destination</div>
          </div>
        </a>

        <!-- Desktop Nav Links -->
        <nav style="display: flex; align-items: center; gap: 2rem;" class="desktop-nav">
          <a href="#" onclick="window.navTo('home'); return false;" style="font-weight: 500; font-size: 0.95rem; color: ${state.currentPage === 'home' ? 'var(--gold-primary)' : 'var(--text-main)'}; border-bottom: 2px solid ${state.currentPage === 'home' ? 'var(--gold-primary)' : 'transparent'}; padding: 0.25rem 0;">Home</a>
          <a href="#" onclick="window.navTo('blog'); return false;" style="font-weight: 500; font-size: 0.95rem; color: ${state.currentPage === 'blog' ? 'var(--gold-primary)' : 'var(--text-main)'}; border-bottom: 2px solid ${state.currentPage === 'blog' ? 'var(--gold-primary)' : 'transparent'}; padding: 0.25rem 0;">Blog & Trends</a>
          <a href="#" onclick="window.navTo('categories'); return false;" style="font-weight: 500; font-size: 0.95rem; color: ${state.currentPage === 'categories' ? 'var(--gold-primary)' : 'var(--text-main)'}; border-bottom: 2px solid ${state.currentPage === 'categories' ? 'var(--gold-primary)' : 'transparent'}; padding: 0.25rem 0;">Categories</a>
          <a href="#" onclick="window.navTo('about'); return false;" style="font-weight: 500; font-size: 0.95rem; color: ${state.currentPage === 'about' ? 'var(--gold-primary)' : 'var(--text-main)'}; border-bottom: 2px solid ${state.currentPage === 'about' ? 'var(--gold-primary)' : 'transparent'}; padding: 0.25rem 0;">About Us</a>
          <a href="#" onclick="window.navTo('contact'); return false;" style="font-weight: 500; font-size: 0.95rem; color: ${state.currentPage === 'contact' ? 'var(--gold-primary)' : 'var(--text-main)'}; border-bottom: 2px solid ${state.currentPage === 'contact' ? 'var(--gold-primary)' : 'transparent'}; padding: 0.25rem 0;">Contact</a>
        </nav>

        <!-- Header Actions -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          
          <!-- Theme Toggle -->
          <button onclick="window.toggleTheme()" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-main); display: flex; align-items: center; justify-content: center;" title="Toggle Dark/Light Mode">
            ${isDark ? getIcon('sun', 18) : getIcon('moon', 18)}
          </button>

          <!-- User Dashboard / Role Button -->
          <div style="position: relative;">
            <button onclick="window.navTo('user-dashboard')" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; border-radius: var(--radius-full); border: 1px solid var(--border-color); background: var(--bg-card);">
              <img src="${state.user.avatar}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;" />
              <span style="font-size: 0.85rem; font-weight: 600;" class="desktop-nav">${state.user.name.split(' ')[0]}</span>
              ${savedCount > 0 ? `<span style="background: var(--gold-gradient); color: #FFF; font-size: 0.7rem; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${savedCount}</span>` : ''}
            </button>
          </div>

          <!-- Admin Portal Link -->
          <button onclick="window.navTo('admin-dashboard')" class="desktop-nav btn-outline" style="padding: 0.4rem 1rem; font-size: 0.85rem; border-color: var(--gold-primary); color: var(--gold-primary);">
            Admin Portal
          </button>

          <!-- Mobile Drawer Toggle -->
          <button onclick="window.toggleDrawer()" class="mobile-menu-btn" style="width: 40px; height: 40px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; color: var(--text-main);">
            ${getIcon('menu', 22)}
          </button>
        </div>

      </div>
    </header>
  `;
}

// Article Card Component Renderer
function renderArticleCard(article) {
  const isLiked = state.likedArticles.includes(article.id);
  const isSaved = state.savedArticles.includes(article.id);
  
  return `
    <div class="fashion-card" style="display: flex; flex-direction: column; height: 100%;">
      <div class="img-hover-zoom" style="height: 240px; cursor: pointer;" onclick="window.navTo('article-detail', { articleId: '${article.id}' })">
        <img src="${article.image}" alt="${article.title}" loading="lazy" />
        <div style="position: absolute; top: 1rem; left: 1rem;">
          <span class="category-badge">${article.category}</span>
        </div>
        <div style="position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.5rem;">
          <button onclick="window.toggleBookmark('${article.id}', event)" style="width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); color: ${isSaved ? 'var(--gold-primary)' : '#FFF'}; display: flex; align-items: center; justify-content: center;" title="Save Article">
            ${getIcon('bookmark', 18)}
          </button>
        </div>
      </div>
      
      <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
        <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          <span>${article.publishedAt}</span>
          <span>•</span>
          <span>${article.readTime}</span>
        </div>
        
        <h3 style="font-size: 1.2rem; line-height: 1.4; margin-bottom: 0.75rem; cursor: pointer;" onclick="window.navTo('article-detail', { articleId: '${article.id}' })">
          ${article.title}
        </h3>
        
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem; flex-grow: 1;">
          ${article.excerpt}
        </p>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: auto;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${article.author.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
            <span style="font-size: 0.85rem; font-weight: 500;">${article.author.name}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button onclick="window.toggleLike('${article.id}', event)" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; color: ${isLiked ? '#E63946' : 'var(--text-muted)'};">
              ${getIcon('heart', 16)}
              <span>${article.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Pages
function renderHomePage() {
  const featuredArticles = state.articles.filter(a => a.featured).slice(0, 3);
  const trendingArticles = state.articles.filter(a => a.trending).slice(0, 6);
  
  return `
    <!-- Hero Section -->
    <section style="position: relative; padding: 5rem 0 6rem; background: linear-gradient(180deg, var(--bg-subtle) 0%, var(--bg-main) 100%); overflow: hidden;">
      <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem; align-items: center;">
        
        <div>
          <span style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 1rem; border-radius: var(--radius-full); background: var(--gold-light); color: var(--gold-primary); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">
            ${getIcon('sparkles', 16)} Designed & Developed by Arshjot Kaur Deol
          </span>
          
          <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1; margin-bottom: 1.5rem; font-weight: 700;">
            Discover Trends.<br>
            <span class="gold-gradient-text">Express Style.</span><br>
            Inspire Fashion.
          </h1>
          
          <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 2.25rem; max-width: 540px; line-height: 1.7;">
            Welcome to <strong>FD Trend Blog (Fashion Destination)</strong>—a luxury fashion editorial hub bringing you haute couture analysis, streetwear drops, sustainable styling, and trend forecasts.
          </p>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button onclick="window.navTo('blog')" class="btn-primary">
              Explore Blogs ${getIcon('arrowRight', 18)}
            </button>
            <button onclick="window.openAuthModal('register')" class="btn-outline">
              Join Community
            </button>
          </div>

          <!-- Quick Stats Counter -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
            <div>
              <div style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: var(--gold-primary);">10K+</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Readers</div>
            </div>
            <div>
              <div style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: var(--gold-primary);">500+</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Articles</div>
            </div>
            <div>
              <div style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: var(--gold-primary);">50+</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Influencers</div>
            </div>
            <div>
              <div style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: var(--gold-primary);">98%</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Satisfaction</div>
            </div>
          </div>
        </div>

        <div style="position: relative;">
          <div style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); border: 2px solid var(--border-color); height: 500px;">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80" alt="Fashion Hero" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <!-- Floating Badge -->
          <div style="position: absolute; bottom: -20px; left: -20px; background: var(--bg-card); border: 1px solid var(--border-color); padding: 1.25rem 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 1rem;">
            <div style="width: 46px; height: 46px; border-radius: 50%; background: var(--gold-gradient); display: flex; align-items: center; justify-content: center; color: #FFF;">
              ${getIcon('sparkles', 24)}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">Autumn / Winter '26</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Curated Style Issue Out Now</div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Categories Carousel / Cards -->
    <section style="padding: 5rem 0;">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem;">
          <div>
            <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem;">Explore Niche Categories</h2>
            <p style="color: var(--text-muted);">Handpicked fashion verticals tailored for style enthusiasts</p>
          </div>
          <button onclick="window.navTo('categories')" class="btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1.25rem;">
            View All Categories
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
          ${CATEGORIES.map(cat => `
            <div class="fashion-card" style="padding: 1.75rem; text-align: center; cursor: pointer;" onclick="window.navTo('blog', { category: '${cat.name}' })">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--bg-subtle); border: 1px solid var(--border-color); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
                ${getIcon(cat.icon, 28)}
              </div>
              <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">${cat.name}</h3>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${cat.count} Articles</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Featured Fashion Articles -->
    <section style="padding: 5rem 0; background: var(--bg-subtle);">
      <div class="container">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 3rem;">
          <span style="color: var(--gold-primary); font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.8rem;">Editor's Pick</span>
          <h2 style="font-size: 2.5rem; margin-top: 0.5rem;">Featured Fashion Stories</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          ${featuredArticles.map(art => renderArticleCard(art)).join('')}
        </div>
      </div>
    </section>

    <!-- Trends of the Week Section -->
    <section style="padding: 5rem 0;">
      <div class="container">
        <div style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem;">Trends of the Week 🔥</h2>
          <p style="color: var(--text-muted);">Real-time search spikes and runaway favorites</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          ${WEEKLY_TRENDS.map(tr => `
            <div class="fashion-card" style="display: flex; gap: 1.25rem; padding: 1.25rem; align-items: center;">
              <img src="${tr.image}" style="width: 100px; height: 100px; border-radius: var(--radius-md); object-fit: cover;" />
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #E63946; background: rgba(230,57,70,0.1); padding: 0.2rem 0.6rem; border-radius: var(--radius-full);">${tr.growth}</span>
                <h4 style="font-size: 1.05rem; margin: 0.5rem 0 0.25rem;">${tr.title}</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted);">${tr.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Featured Influencers Spotlight -->
    <section style="padding: 5rem 0; background: var(--bg-subtle);">
      <div class="container">
        <div style="text-align: center; margin-bottom: 3rem;">
          <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem;">Featured Influencers</h2>
          <p style="color: var(--text-muted);">Voices shaping global style narratives</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          ${FEATURED_INFLUENCERS.map(inf => `
            <div class="fashion-card" style="padding: 2rem; text-align: center;">
              <img src="${inf.avatar}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 3px solid var(--gold-primary);" />
              <h3 style="font-size: 1.2rem; margin-bottom: 0.2rem;">${inf.name}</h3>
              <div style="font-size: 0.85rem; color: var(--gold-primary); font-weight: 600; margin-bottom: 0.5rem;">${inf.handle} (${inf.followers})</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem; font-style: italic;">"${inf.quote}"</div>
              <span class="category-badge">${inf.niche}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Popular Brands Showcase -->
    <section style="padding: 4rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container" style="text-align: center;">
        <p style="font-size: 0.85rem; uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 2rem;">RECOGNIZED BY & INSPIRING TOP FASHION BRANDS</p>
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem; align-items: center;">
          ${POPULAR_BRANDS.map(b => `
            <div style="display: flex; align-items: center; gap: 0.5rem; opacity: 0.85;">
              <span style="font-size: 1.5rem;">${b.logo}</span>
              <div>
                <div style="font-family: var(--font-serif); font-weight: 700; font-size: 1.1rem; letter-spacing: 0.05em;">${b.name}</div>
                <div style="font-size: 0.65rem; color: var(--gold-primary); text-transform: uppercase;">${b.tag}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Instagram Gallery Preview -->
    <section style="padding: 5rem 0;">
      <div class="container">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem;">@FDTrendBlog on Instagram</h2>
          <p style="color: var(--text-muted);">Tag #FDTrendStyle to get featured on our page</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem;" class="instagram-grid">
          ${INSTAGRAM_POSTS.map(post => `
            <div class="img-hover-zoom" style="border-radius: var(--radius-md); height: 180px; position: relative;">
              <img src="${post.image}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s; display: flex; align-items: center; justify-content: center; color: #FFF; font-weight: 600; gap: 0.4rem;" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0">
                ${getIcon('heart', 16)} ${post.likes}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section style="padding: 5rem 0; background: var(--bg-subtle);">
      <div class="container">
        <div style="text-align: center; margin-bottom: 3rem;">
          <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem;">Reader & Community Feedback</h2>
          <p style="color: var(--text-muted);">What fashion enthusiasts say about FD Trend</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          ${TESTIMONIALS.map(t => `
            <div class="fashion-card" style="padding: 2rem;">
              <div style="color: var(--gold-primary); font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
              <p style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.6;">"${t.comment}"</p>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${t.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem;">${t.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${t.role}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Newsletter Banner -->
    <section style="padding: 5rem 0;">
      <div class="container">
        <div style="background: var(--gold-gradient); border-radius: var(--radius-lg); padding: 4rem 2rem; text-align: center; color: #FFF; box-shadow: var(--shadow-lg);">
          <span style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.8rem; font-weight: 700; opacity: 0.9;">Join 10,000+ Fashion Insiders</span>
          <h2 style="font-size: 2.5rem; color: #FFF; margin: 0.5rem 0 1rem;">Subscribe to FD Trend Weekly Brief</h2>
          <p style="max-width: 500px; margin: 0 auto 2rem; opacity: 0.95; font-size: 1.05rem;">Get runway reports, exclusive styling guides, and sustainable fashion news straight to your inbox.</p>
          
          <form onsubmit="window.handleNewsletter(event)" style="display: flex; max-width: 480px; margin: 0 auto; gap: 0.5rem; background: rgba(255,255,255,0.2); padding: 0.4rem; border-radius: var(--radius-full); backdrop-filter: blur(10px);">
            <input type="email" placeholder="Enter your email address..." required style="flex-grow: 1; border: none; background: transparent; padding: 0.75rem 1.25rem; color: #FFF; outline: none; font-size: 0.95rem;" />
            <button type="submit" style="background: #FFF; color: var(--text-main); font-weight: 700; padding: 0.75rem 1.5rem; border-radius: var(--radius-full);">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  `;
}

function renderBlogPage() {
  let filtered = state.articles;
  
  if (state.selectedCategory && state.selectedCategory !== 'All') {
    filtered = filtered.filter(a => a.category.toLowerCase() === state.selectedCategory.toLowerCase());
  }
  
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.excerpt.toLowerCase().includes(q) || 
      a.category.toLowerCase().includes(q)
    );
  }
  
  if (state.sortBy === 'popular') {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  } else if (state.sortBy === 'views') {
    filtered = [...filtered].sort((a, b) => b.views - a.views);
  } else {
    filtered = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  const categoryOptions = ['All', "Women's Fashion", "Men's Fashion", 'Streetwear', 'Luxury Fashion', 'Sustainable Fashion', 'Fashion Tips'];

  return `
    <div class="container" style="padding: 4rem 1.5rem;">
      <div style="text-align: center; max-width: 640px; margin: 0 auto 3rem;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Fashion Editorial & Articles</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem;">Explore curated style insights, fashion tips, runway highlights, and industry breakdowns.</p>
      </div>

      <!-- Controls & Filter Bar -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 3rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; align-items: center;">
          
          <!-- Search Bar -->
          <div style="position: relative; width: 100%; max-width: 360px;">
            <input type="text" placeholder="Search fashion articles, trends..." value="${state.searchQuery}" oninput="window.setSearch(this.value)" style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border-radius: var(--radius-full); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main); outline: none;" />
            <div style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">
              ${getIcon('search', 18)}
            </div>
          </div>

          <!-- Sort Select -->
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Sort By:</span>
            <select onchange="window.setSort(this.value)" style="padding: 0.6rem 1rem; border-radius: var(--radius-full); border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-main); outline: none;">
              <option value="latest" ${state.sortBy === 'latest' ? 'selected' : ''}>Latest Published</option>
              <option value="popular" ${state.sortBy === 'popular' ? 'selected' : ''}>Most Liked</option>
              <option value="views" ${state.sortBy === 'views' ? 'selected' : ''}>Most Viewed</option>
            </select>
          </div>

        </div>

        <!-- Category Pills -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color);">
          ${categoryOptions.map(cat => `
            <button onclick="window.setCategory('${cat}')" class="filter-pill ${state.selectedCategory === cat ? 'active' : ''}">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Articles Grid -->
      ${filtered.length > 0 ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          ${filtered.map(art => renderArticleCard(art)).join('')}
        </div>
      ` : `
        <div style="text-align: center; padding: 5rem 0;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No fashion articles found</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your search criteria or category filter.</p>
          <button onclick="window.setCategory('All'); window.setSearch('');" class="btn-primary">Reset Filters</button>
        </div>
      `}
    </div>
  `;
}

function renderArticleDetailPage() {
  const article = state.articles.find(a => a.id === state.selectedArticleId) || state.articles[0];
  const isLiked = state.likedArticles.includes(article.id);
  const isSaved = state.savedArticles.includes(article.id);
  const articleComments = state.comments.filter(c => c.articleId === article.id);
  const related = state.articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  return `
    <div class="container" style="padding: 4rem 1.5rem; max-width: 900px;">
      
      <button onclick="window.navTo('blog')" class="btn-outline" style="margin-bottom: 2rem; font-size: 0.85rem; padding: 0.4rem 1rem;">
        ← Back to Articles
      </button>

      <span class="category-badge" style="margin-bottom: 1rem;">${article.category}</span>
      
      <h1 style="font-size: clamp(2.2rem, 4vw, 3.2rem); line-height: 1.2; margin-bottom: 1.5rem;">
        ${article.title}
      </h1>

      <!-- Author Info Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="${article.author.avatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />
          <div>
            <div style="font-weight: 700; font-size: 1rem;">${article.author.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${article.author.role}</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
          <span>${article.publishedAt}</span>
          <span>•</span>
          <span>${article.readTime}</span>
          <span>•</span>
          <span>${article.views} Views</span>
        </div>
      </div>

      <!-- Featured Image -->
      <div style="border-radius: var(--radius-lg); overflow: hidden; height: 440px; margin-bottom: 3rem; box-shadow: var(--shadow-md);">
        <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <!-- Article Rich Content -->
      <div class="article-body">
        ${article.content}
      </div>

      <!-- Actions Bar (Like, Bookmark, Share) -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin: 3.5rem 0;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button onclick="window.toggleLike('${article.id}')" class="btn-outline" style="color: ${isLiked ? '#E63946' : 'var(--text-main)'}; border-color: ${isLiked ? '#E63946' : 'var(--border-color)'}">
            ${getIcon('heart', 18)} <span>${article.likes} Likes</span>
          </button>
          
          <button onclick="window.toggleBookmark('${article.id}')" class="btn-outline" style="color: ${isSaved ? 'var(--gold-primary)' : 'var(--text-main)'}; border-color: ${isSaved ? 'var(--gold-primary)' : 'var(--border-color)'}">
            ${getIcon('bookmark', 18)} <span>${isSaved ? 'Saved' : 'Save Article'}</span>
          </button>
        </div>

        <button onclick="window.copyArticleLink()" class="btn-outline" style="gap: 0.5rem;">
          ${getIcon('share', 18)} Share
        </button>
      </div>

      <!-- Author Bio Box -->
      <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 2rem; display: flex; gap: 1.5rem; align-items: center; margin-bottom: 4rem;">
        <img src="${article.author.avatar}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover;" />
        <div>
          <h4 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Written by ${article.author.name}</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted);">${article.author.bio}</p>
        </div>
      </div>

      <!-- Comments Section -->
      <section style="margin-bottom: 4rem;">
        <h3 style="font-size: 1.75rem; margin-bottom: 1.5rem;">Discussion (${articleComments.length})</h3>

        <!-- Comment Form -->
        <form onsubmit="window.postComment(event, '${article.id}')" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2.5rem;">
          <textarea id="commentInput" placeholder="Share your thoughts on this trend..." required style="width: 100%; height: 90px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.75rem; background: var(--bg-main); color: var(--text-main); outline: none; margin-bottom: 1rem; resize: none;"></textarea>
          <div style="display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-primary">Post Comment</button>
          </div>
        </form>

        <!-- Comments List -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${articleComments.map(c => `
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <img src="${c.userAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                  <span style="font-weight: 600; font-size: 0.9rem;">${c.userName}</span>
                </div>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${c.createdAt}</span>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5; padding-left: 2.5rem;">${c.text}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Related Articles -->
      ${related.length > 0 ? `
        <section>
          <h3 style="font-size: 1.75rem; margin-bottom: 1.5rem;">Related Fashion Articles</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
            ${related.map(art => renderArticleCard(art)).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
}

function renderCategoriesPage() {
  return `
    <div class="container" style="padding: 4rem 1.5rem;">
      <div style="text-align: center; max-width: 600px; margin: 0 auto 3.5rem;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Fashion Categories</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem;">Explore specialized verticals across high fashion, streetwear, sustainability, and personal styling.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
        ${CATEGORIES.map(cat => `
          <div class="fashion-card" style="display: flex; flex-direction: column;" onclick="window.navTo('blog', { category: '${cat.name}' })">
            <div class="img-hover-zoom" style="height: 200px;">
              <img src="${cat.image}" alt="${cat.name}" />
              <div style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: #FFF; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;">
                ${cat.count} Articles
              </div>
            </div>
            <div style="padding: 1.75rem; flex-grow: 1; display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div style="color: var(--gold-primary);">${getIcon(cat.icon, 24)}</div>
                <h3 style="font-size: 1.3rem;">${cat.name}</h3>
              </div>
              <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1;">
                ${cat.description}
              </p>
              <button class="btn-outline" style="width: 100%; justify-content: center; font-size: 0.85rem;">
                Explore Category ${getIcon('arrowRight', 16)}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAboutPage() {
  const dev = DEVELOPER_PROFILE;
  return `
    <div class="container" style="padding: 4rem 1.5rem; max-width: 960px;">
      
      <!-- Hero Section -->
      <div style="text-align: center; margin-bottom: 4rem;">
        <span class="category-badge" style="margin-bottom: 1rem;">College Capstone Project</span>
        <h1 style="font-size: 3.2rem; margin-bottom: 1.25rem;">About FD Trend Blog</h1>
        <p style="font-size: 1.2rem; color: var(--text-muted); max-width: 700px; margin: 0 auto; line-height: 1.7;">
          FD Trend (Fashion Destination) is a digital blogging platform conceptualized and crafted by a BCA (Bachelor of Computer Applications) student to bridge high-end fashion design with modern web technology.
        </p>
      </div>

      <!-- Mission & Vision Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 5rem;">
        <div class="fashion-card" style="padding: 2.5rem;">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: var(--gold-light); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
            ${getIcon('sparkles', 26)}
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Our Mission</h3>
          <p style="color: var(--text-muted); line-height: 1.7;">
            To empower fashion enthusiasts, students, and influencers with real-time editorial trend analysis, accessible styling tips, and an engaging community space.
          </p>
        </div>

        <div class="fashion-card" style="padding: 2.5rem;">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: var(--gold-light); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
            ${getIcon('crown', 26)}
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Our Vision</h3>
          <p style="color: var(--text-muted); line-height: 1.7;">
            To set a new benchmark for web application UI/UX elegance by combining sleek dark/light mode architecture, modular state management, and fashion-first design principles.
          </p>
        </div>
      </div>

      <!-- Developer Profile Section -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 3rem; box-shadow: var(--shadow-md);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2.5rem; align-items: center;">
          <div>
            <span style="color: var(--gold-primary); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em;">Developer Portfolio</span>
            <h2 style="font-size: 2.2rem; margin: 0.5rem 0 1rem;">${dev.name}</h2>
            <div style="font-weight: 600; color: var(--text-muted); margin-bottom: 1rem;">${dev.college}</div>
            <p style="color: var(--text-main); line-height: 1.7; margin-bottom: 1.5rem;">${dev.bio}</p>

            <h4 style="font-size: 1rem; margin-bottom: 0.75rem;">Technical Skills Demonstrated:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
              ${dev.skills.map(s => `<span class="category-badge" style="background: var(--bg-subtle);">${s}</span>`).join('')}
            </div>

            <div style="display: flex; gap: 1rem;">
              <a href="${dev.socials.github}" target="_blank" class="btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1.25rem;">GitHub Portfolio</a>
              <a href="mailto:${dev.email}" class="btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1.25rem;">Contact Developer</a>
            </div>
          </div>

          <div style="text-align: center;">
            <div style="width: 220px; height: 220px; border-radius: 50%; overflow: hidden; margin: 0 auto; border: 4px solid var(--gold-primary); box-shadow: var(--shadow-lg);">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="BCA Developer" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

function renderContactPage() {
  return `
    <div class="container" style="padding: 4rem 1.5rem; max-width: 1000px;">
      
      <div style="text-align: center; margin-bottom: 4rem;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Get in Touch</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem;">Have questions, collaboration ideas, or feedback? Send us a message.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem; margin-bottom: 4rem;">
        
        <!-- Contact Form -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 2.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Send Message</h3>
          <form onsubmit="window.handleContactSubmit(event)">
            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Full Name</label>
              <input type="text" placeholder="John Doe" required style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main); outline: none;" />
            </div>
            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Email Address</label>
              <input type="email" placeholder="john@example.com" required style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main); outline: none;" />
            </div>
            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Subject</label>
              <input type="text" placeholder="Brand Collaboration / General Query" required style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main); outline: none;" />
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Message</label>
              <textarea placeholder="Write your message here..." required style="width: 100%; height: 120px; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main); outline: none; resize: none;"></textarea>
            </div>
            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">Send Message</button>
          </form>
        </div>

        <!-- Contact Info & Map Placeholder -->
        <div>
          <div class="fashion-card" style="padding: 2rem; margin-bottom: 2rem;">
            <h3 style="font-size: 1.3rem; margin-bottom: 1.25rem;">Contact Information</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.95rem;">
              <div>
                <strong style="color: var(--gold-primary);">Email:</strong> contact@fdtrendblog.com
              </div>
              <div>
                <strong style="color: var(--gold-primary);">Student Project Lead:</strong> Arshjot Kaur Deol (BCA)
              </div>
              <div>
                <strong style="color: var(--gold-primary);">Location:</strong> Fashion Tech Hub, Paris / New Delhi
              </div>
            </div>
          </div>

          <!-- Google Maps Placeholder -->
          <div style="border-radius: var(--radius-lg); overflow: hidden; height: 260px; border: 1px solid var(--border-color); position: relative; background: url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80') center/cover;">
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #FFF; text-align: center; padding: 1.5rem;">
              <span style="font-size: 2rem; margin-bottom: 0.5rem;">📍</span>
              <h4 style="font-size: 1.2rem; color: #FFF; margin-bottom: 0.25rem;">Interactive Map Preview</h4>
              <p style="font-size: 0.85rem; opacity: 0.9;">FD Trend Editorial Headquarters</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

function renderUserDashboard() {
  const savedList = state.articles.filter(a => state.savedArticles.includes(a.id));
  const likedList = state.articles.filter(a => state.likedArticles.includes(a.id));

  return `
    <div class="container" style="padding: 4rem 1.5rem; max-width: 1050px;">
      
      <!-- Profile Header -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2.5rem; margin-bottom: 3rem; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
        <img src="${state.user.avatar}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gold-primary);" />
        <div style="flex-grow: 1;">
          <h2 style="font-size: 2rem; margin-bottom: 0.25rem;">${state.user.name}</h2>
          <div style="color: var(--gold-primary); font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem;">${state.user.email} (${state.user.role.toUpperCase()})</div>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${state.user.bio}</p>
        </div>
      </div>

      <!-- Dashboard Tabs -->
      <div style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem;">Saved Articles (${savedList.length})</h2>
        ${savedList.length > 0 ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            ${savedList.map(art => renderArticleCard(art)).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: 3rem 0; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <p style="color: var(--text-muted);">No saved articles yet. Browse the blog to bookmark stories!</p>
          </div>
        `}
      </div>

      <div>
        <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem;">Liked Posts (${likedList.length})</h2>
        ${likedList.length > 0 ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            ${likedList.map(art => renderArticleCard(art)).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: 3rem 0; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <p style="color: var(--text-muted);">No liked posts yet.</p>
          </div>
        `}
      </div>

    </div>
  `;
}

function renderAdminDashboard() {
  return `
    <div class="container" style="padding: 4rem 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Admin Management Portal</h1>
          <p style="color: var(--text-muted);">Overview analytics and article management for FD Trend</p>
        </div>
        <button onclick="window.openAdminModal()" class="btn-primary">
          ${getIcon('plus', 18)} Create New Article
        </button>
      </div>

      <!-- Quick Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <div class="fashion-card" style="padding: 1.5rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Total Articles</div>
          <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--gold-primary); margin-top: 0.5rem;">${state.articles.length}</div>
        </div>
        <div class="fashion-card" style="padding: 1.5rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Total Likes</div>
          <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--gold-primary); margin-top: 0.5rem;">${state.articles.reduce((acc, a) => acc + a.likes, 0)}</div>
        </div>
        <div class="fashion-card" style="padding: 1.5rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Total Views</div>
          <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--gold-primary); margin-top: 0.5rem;">${state.articles.reduce((acc, a) => acc + a.views, 0)}</div>
        </div>
        <div class="fashion-card" style="padding: 1.5rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Total Comments</div>
          <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--gold-primary); margin-top: 0.5rem;">${state.comments.length}</div>
        </div>
      </div>

      <!-- Articles Management Table -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);">
        <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); font-weight: 700; font-size: 1.2rem;">
          Manage Articles
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--bg-subtle); border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 1rem 1.5rem;">Title</th>
                <th style="padding: 1rem 1.5rem;">Category</th>
                <th style="padding: 1rem 1.5rem;">Author</th>
                <th style="padding: 1rem 1.5rem;">Likes</th>
                <th style="padding: 1rem 1.5rem;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.articles.map(art => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 1rem 1.5rem; font-weight: 600; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${art.title}</td>
                  <td style="padding: 1rem 1.5rem;"><span class="category-badge">${art.category}</span></td>
                  <td style="padding: 1rem 1.5rem;">${art.author.name}</td>
                  <td style="padding: 1rem 1.5rem;">${art.likes}</td>
                  <td style="padding: 1rem 1.5rem;">
                    <div style="display: flex; gap: 0.5rem;">
                      <button onclick="window.editArticle('${art.id}')" style="color: var(--gold-primary);" title="Edit Article">${getIcon('edit', 18)}</button>
                      <button onclick="window.deleteArticle('${art.id}')" style="color: #E63946;" title="Delete Article">${getIcon('trash', 18)}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// Render Footer
function renderFooter() {
  return `
    <footer style="background: var(--bg-card); border-top: 1px solid var(--border-color); padding: 5rem 0 3rem; margin-top: 5rem;">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem; margin-bottom: 4rem;">
          
          <div>
            <a href="#" onclick="window.navTo('home'); return false;" style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: var(--gold-gradient); display: flex; align-items: center; justify-content: center; color: #FFF; font-family: var(--font-serif); font-weight: 700; font-size: 1.2rem;">FD</div>
              <span style="font-family: var(--font-serif); font-weight: 700; font-size: 1.2rem;">FD TREND</span>
            </a>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
              Fashion Destination (FD Trend) is a modern blogging platform developed as a BCA college project to deliver high-aesthetic style stories, street fashion, and sustainable couture insights.
            </p>
          </div>

          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 1.25rem;">Quick Links</h4>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem; color: var(--text-muted);">
              <a href="#" onclick="window.navTo('home'); return false;">Home</a>
              <a href="#" onclick="window.navTo('blog'); return false;">Blog & Articles</a>
              <a href="#" onclick="window.navTo('categories'); return false;">Categories</a>
              <a href="#" onclick="window.navTo('about'); return false;">About Us (BCA Project)</a>
              <a href="#" onclick="window.navTo('contact'); return false;">Contact Us</a>
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 1.25rem;">Categories</h4>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem; color: var(--text-muted);">
              ${CATEGORIES.map(c => `
                <a href="#" onclick="window.navTo('blog', { category: '${c.name}' }); return false;">${c.name}</a>
              `).join('')}
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 1.25rem;">Newsletter</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Stay updated with our latest style trends.</p>
            <form onsubmit="window.handleNewsletter(event)" style="display: flex; flex-direction: column; gap: 0.5rem;">
              <input type="email" placeholder="Your email..." required style="padding: 0.65rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main); outline: none; font-size: 0.85rem;" />
              <button type="submit" class="btn-primary" style="padding: 0.65rem 1rem; font-size: 0.85rem;">Subscribe</button>
            </form>
          </div>

        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
          <div>© 2026 FD Trend Blog. All Rights Reserved. | Designed & Developed by Arshjot Kaur Deol.</div>
          <div style="display: flex; gap: 1.5rem;">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Render Admin Modal
function renderAdminModal() {
  if (!state.adminModalOpen) return '';
  const editing = state.articles.find(a => a.id === state.editingArticleId);

  return `
    <div class="modal-overlay active">
      <div class="modal-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.4rem;">${editing ? 'Edit Fashion Article' : 'Create New Article'}</h3>
          <button onclick="window.closeAdminModal()" style="color: var(--text-muted);">${getIcon('close', 20)}</button>
        </div>
        <form onsubmit="window.saveAdminArticle(event)">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">Title</label>
            <input type="text" id="adminTitle" value="${editing ? editing.title : ''}" required style="width: 100%; padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main);" />
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">Category</label>
            <select id="adminCategory" style="width: 100%; padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main);">
              ${CATEGORIES.map(c => `<option value="${c.name}" ${editing && editing.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">Image URL</label>
            <input type="url" id="adminImage" value="${editing ? editing.image : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'}" required style="width: 100%; padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main);" />
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">Excerpt</label>
            <textarea id="adminExcerpt" required style="width: 100%; height: 70px; padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main);">${editing ? editing.excerpt : ''}</textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" onclick="window.closeAdminModal()" class="btn-outline">Cancel</button>
            <button type="submit" class="btn-primary">Save Article</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Global App Renderer
function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  let pageHTML = '';
  switch (state.currentPage) {
    case 'home': pageHTML = renderHomePage(); break;
    case 'blog': pageHTML = renderBlogPage(); break;
    case 'article-detail': pageHTML = renderArticleDetailPage(); break;
    case 'categories': pageHTML = renderCategoriesPage(); break;
    case 'about': pageHTML = renderAboutPage(); break;
    case 'contact': pageHTML = renderContactPage(); break;
    case 'user-dashboard': pageHTML = renderUserDashboard(); break;
    case 'admin-dashboard': pageHTML = renderAdminDashboard(); break;
    default: pageHTML = renderHomePage();
  }

  root.innerHTML = `
    ${renderHeader()}
    <main>${pageHTML}</main>
    ${renderFooter()}
    ${renderAdminModal()}
    <div id="toastContainer" class="toast-container"></div>
  `;
}

// Global Window Bindings for Inline Listeners
window.navTo = (page, params) => navigateTo(page, params);
window.toggleTheme = toggleTheme;
window.toggleLike = toggleLike;
window.toggleBookmark = toggleBookmark;
window.setCategory = (cat) => { state.selectedCategory = cat; state.currentPage = 'blog'; renderApp(); };
window.setSearch = (q) => { state.searchQuery = q; state.currentPage = 'blog'; renderApp(); };
window.setSort = (s) => { state.sortBy = s; renderApp(); };
window.handleNewsletter = (e) => {
  e.preventDefault();
  showToast('Subscription successful! Check your inbox for the weekly fashion brief.');
  e.target.reset();
};
window.handleContactSubmit = (e) => {
  e.preventDefault();
  showToast('Thank you! Your message has been sent to the FD Trend team.');
  e.target.reset();
};
window.postComment = (e, articleId) => {
  e.preventDefault();
  const input = document.getElementById('commentInput');
  if (!input || !input.value.trim()) return;
  
  const newComment = {
    id: `com-${Date.now()}`,
    articleId: articleId,
    userName: state.user.name,
    userAvatar: state.user.avatar,
    text: input.value.trim(),
    createdAt: 'Just now'
  };
  state.comments.unshift(newComment);
  saveComments();
  showToast('Comment posted successfully!');
  renderApp();
};
window.copyArticleLink = () => {
  navigator.clipboard.writeText(window.location.href);
  showToast('Article link copied to clipboard!');
};
window.openAdminModal = () => { state.editingArticleId = null; state.adminModalOpen = true; renderApp(); };
window.closeAdminModal = () => { state.adminModalOpen = false; renderApp(); };
window.editArticle = (id) => { state.editingArticleId = id; state.adminModalOpen = true; renderApp(); };
window.deleteArticle = (id) => {
  if (confirm('Are you sure you want to delete this article?')) {
    state.articles = state.articles.filter(a => a.id !== id);
    saveArticles();
    showToast('Article deleted');
    renderApp();
  }
};
window.saveAdminArticle = (e) => {
  e.preventDefault();
  const title = document.getElementById('adminTitle').value;
  const category = document.getElementById('adminCategory').value;
  const image = document.getElementById('adminImage').value;
  const excerpt = document.getElementById('adminExcerpt').value;
  
  if (state.editingArticleId) {
    const art = state.articles.find(a => a.id === state.editingArticleId);
    if (art) {
      art.title = title;
      art.category = category;
      art.image = image;
      art.excerpt = excerpt;
    }
    showToast('Article updated');
  } else {
    const newArt = {
      id: `art-${Date.now()}`,
      title,
      category,
      image,
      excerpt,
      content: `<p class="lead">${excerpt}</p><p>Explore more details about this trend on FD Trend Blog.</p>`,
      author: {
        name: state.user.name,
        avatar: state.user.avatar,
        role: "BCA Editorial Contributor",
        bio: "Fashion blogger and developer."
      },
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '4 min read',
      featured: false,
      trending: true,
      likes: 12,
      views: 85,
      tags: [category, "New Drop"]
    };
    state.articles.unshift(newArt);
    showToast('New article published!');
  }
  saveArticles();
  state.adminModalOpen = false;
  renderApp();
};

// Initial App Launch
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderApp();
});
