import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { pickImage, categoryImage } from '../data';

const categories = ['Fashion', 'Trends', 'Designers', 'Collections', 'Street Style', 'Beauty', 'Culture', 'Editorial'];

export default function ArticleArchivePage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'Fashion';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    api.getArticles({ category, limit: 30 })
      .then(data => { if (alive) setArticles(data); })
      .catch(err => { if (alive) setError(err.message || 'Could not load stories.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category]);

  return (
    <div className="container archive-page">
      <div className="page-intro archive-intro">
        <div className="eyebrow">FD Trend / Journal archive</div>
        <h1 className="display">{category}.</h1>
        <p className="page-deck">Fashion stories, observations and design thinking edited for readers who want more than a quick trend list.</p>
      </div>

      <nav className="category-nav" aria-label="Journal categories">
        {categories.map(item => (
          <button
            key={item}
            className={item === category ? 'category-pill active' : 'category-pill'}
            onClick={() => setParams({ category: item })}
          >
            {item}
          </button>
        ))}
      </nav>

      {loading && <div className="loading-state">Opening the {category.toLowerCase()} journal...</div>}
      {!loading && error && <div className="error-state">{error}</div>}
      {!loading && !error && articles.length === 0 && (
        <div className="empty-state">No stories are published in this section yet.</div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="archive-grid archive-grid-enhanced">
          {articles.map((article, index) => (
            <article className="archive-card" key={article.id}>
              <Link to={`/articles/${article.slug}`}>
                <img src={categoryImage(category, index) || pickImage(article.cover_image, index)} alt={article.title} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = category.toLowerCase().includes('beauty') ? '/images/beauty-cover.jpg' : '/images/fd-trend-editorial.jpeg'; }} />
              </Link>
              <div>
                <div className="story-tag">{article.category_name} / {article.read_time || '5 min read'}</div>
                <Link to={`/articles/${article.slug}`}><h3>{article.title}</h3></Link>
                <p>{article.excerpt}</p>
                <Link className="text-link" to={`/articles/${article.slug}`}>Read story /</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
