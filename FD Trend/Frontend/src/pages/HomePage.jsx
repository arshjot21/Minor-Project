import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { pickImage, localVisuals } from '../data';

export default function HomePage() {
  const { token, user } = useAuth();
  const [articles,setArticles]=useState([]), [trends,setTrends]=useState([]), [designers,setDesigners]=useState([]), [street,setStreet]=useState([]), [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{try{const [a,t,d,s]=await Promise.all([api.getArticles({limit:12},token),api.getTrends(token),api.getDesigners({limit:4},token),api.getStreetStyle({limit:5},token)]);setArticles(a);setTrends(t);setDesigners(d);setStreet(s);}catch(e){console.error(e)}finally{setLoading(false)}})()},[token,user]);
  if(loading) return <div className="container loading-state">Opening the journal...</div>;
  const hero=articles[0], feature=articles[1], list=articles.slice(2,7);
  return <div>
    <div className="container page-intro"><div className="eyebrow">FD Trend / Issue 06 / Fashion Design</div><h1 className="display">The fashion<br/>design journal.</h1><p className="page-deck">A considered space for runway stories, designer thinking, emerging trends, street style and the details that make clothing worth looking at twice.</p></div>
    <section className="container trend-editorial-section">
      <div className="trend-editorial-heading">
        <div className="eyebrow">Inside the platform</div>
        <h2 className="section-title">What a Fashion Trend Blog Includes</h2>
        <p className="trend-editorial-lead">FD Trend goes beyond outfit inspiration. It follows the ideas, materials, cultures and product categories shaping fashion before they become everywhere.</p>
      </div>
      <div className="trend-editorial-list">
        <article className="trend-editorial-item"><span className="trend-editorial-no">01</span><div><h3>Seasonal Forecasting</h3><p>Breakdowns for upcoming seasons such as Spring/Summer and Autumn/Winter, tracking expected shifts in colours, fabrics, textures and silhouettes.</p></div></article>
        <article className="trend-editorial-item"><span className="trend-editorial-no">02</span><div><h3>Cultural &amp; Subcultural Movements</h3><p>Analysis of how lifestyle changes, youth culture, music, art and urban behaviour influence the way people dress and style themselves.</p></div></article>
        <article className="trend-editorial-item"><span className="trend-editorial-no">03</span><div><h3>Category-Specific Reports</h3><p>Focused reports on footwear, handbags, jewellery, accessories, denim, tailoring and activewear, with attention to the details driving each category.</p></div></article>
        <article className="trend-editorial-item"><span className="trend-editorial-no">04</span><div><h3>Regional Insights</h3><p>Market-specific trend analysis shaped around local consumer preferences, regional styling habits and the way global ideas are interpreted locally.</p></div></article>
        <article className="trend-editorial-item"><span className="trend-editorial-no">05</span><div><h3>Design &amp; Material Innovations</h3><p>Updates on sustainable materials, heritage utility, new textile ideas and modern production methods changing the future of fashion design.</p></div></article>
      </div>
    </section>

    {hero && <section className="container-wide editorial-hero">
      <Link to={`/articles/${hero.slug}`} className="hero-image"><img src="/images/fd-trend-hero.png" alt={hero.title}/><span className="hero-index">01 / COVER STORY</span></Link>
      <div className="hero-copy"><div><div className="hero-kicker">{hero.category_name} / {hero.read_time || '5 min read'}</div><Link to={`/articles/${hero.slug}`}><h2 className="hero-title">{hero.title}</h2></Link><p className="hero-excerpt">{hero.excerpt}</p></div><div><Link className="text-link" to={`/articles/${hero.slug}`}>Read the story /</Link><div className="hero-meta"><span>By {hero.author_name}</span><span>{new Date(hero.published_at).toLocaleDateString('en-GB',{month:'short',year:'numeric'})}</span></div></div></div>
    </section>}


    <section className="container section visual-dispatch">
      <div className="section-head">
        <div><div className="eyebrow">01 / Visual dispatches</div><h2 className="section-title">Three ways to read the season.</h2></div>
        <div className="section-rule"/>
      </div>
      <div className="visual-dispatch-grid">
        <Link className="visual-dispatch-card visual-dispatch-large" to="/articles?category=Beauty">
          <img src={localVisuals.beauty} alt="Beauty editorial portrait"/>
          <div className="visual-dispatch-caption"><span>BEAUTY</span><strong>The new ease of everyday beauty</strong><em>Portrait / texture / mood</em></div>
        </Link>
        <Link className="visual-dispatch-card" to="/articles?category=Culture">
          <img src={localVisuals.culture} alt="Culture and fashion editorial"/>
          <div className="visual-dispatch-caption"><span>CULTURE</span><strong>When the landscape becomes part of the look</strong><em>Culture / movement / identity</em></div>
        </Link>
        <Link className="visual-dispatch-card" to="/articles?category=Collections">
          <img src={localVisuals.collections} alt="Evening fashion editorial"/>
          <div className="visual-dispatch-caption"><span>COLLECTIONS</span><strong>After dark: the return of the long line</strong><em>Silhouette / accessories / styling</em></div>
        </Link>
      </div>
    </section>

    <section className="container section"><div className="section-head"><div><div className="eyebrow">01 / What is moving now</div><h2 className="section-title">The Trend Index</h2></div><div className="section-rule"/><Link className="text-link" to="/trends">View all trends /</Link></div>
      <div className="trend-list">{trends.slice(0,6).map((t,i)=><Link className="trend-row" to={`/trends/${t.slug}`} key={t.id}><span className="trend-no">0{i+1}</span><span className="trend-name">{t.name}</span><span className="trend-copy">{t.description}</span><span className="trend-score">{t.popularity_score}%</span></Link>)}</div>
    </section>

    {feature && <section className="container section"><div className="section-head"><div><div className="eyebrow">02 / Long read</div><h2 className="section-title">From the Journal</h2></div><div className="section-rule"/></div>
      <div className="story-grid"><article className="story-feature"><Link to={`/articles/${feature.slug}`}><img src="/images/fd-trend-editorial.jpeg" alt={feature.title}/></Link><div><div className="story-tag">{feature.category_name}</div><Link to={`/articles/${feature.slug}`}><h3 className="story-feature-title">{feature.title}</h3></Link><p className="story-feature-copy">{feature.excerpt}</p><Link className="text-link" to={`/articles/${feature.slug}`}>Continue reading /</Link></div></article>
      <div className="story-list">{list.map((a,i)=><Link className="story-item" key={a.id} to={`/articles/${a.slug}`}><img src={pickImage(a.cover_image,i+3)} alt={a.title} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = String(a.category_name || '').toLowerCase().includes('beauty') ? '/images/beauty-cover.jpg' : '/images/fd-trend-editorial.jpeg'; }}/><div><div className="story-tag">{a.category_name}</div><h3 className="story-title">{a.title}</h3><p className="story-excerpt">{a.excerpt}</p></div></Link>)}</div></div>
    </section>}

    <section className="container section"><div className="quote-band"><div className="quote-credit">03 / Editor's note</div><blockquote>Good fashion writing begins with looking carefully.</blockquote></div></section>

    <section className="container-wide section"><div className="image-feature"><div className="image-feature-copy"><div><div className="eyebrow">04 / Street File</div><h2 className="section-title" style={{fontSize:'58px'}}>Clothes in context.</h2><p className="page-deck" style={{fontSize:'21px'}}>Street style is where runway ideas become personal. Browse silhouettes, layering, proportion and texture from different cities.</p></div><Link className="text-link" to="/street-style">Enter the Street File /</Link></div><div className="image-feature-image"><img src="/images/fd-trend-street-style.jpeg" alt={street[0]?.title || 'Street style'}/></div></div></section>

    <section className="container section"><div className="section-head"><div><div className="eyebrow">05 / People shaping the visual language</div><h2 className="section-title">Designers to know</h2></div><div className="section-rule"/><Link className="text-link" to="/designers">All designers /</Link></div><div className="designer-strip">{designers.map((d,i)=><Link className="designer-tile" to={`/designers/${d.id}`} key={d.id}><img src={pickImage(d.profile_image, i+8)} alt={d.name}/><div className="designer-tile-copy"><div className="designer-name">{d.name}</div><div className="designer-meta">{d.country} / {d.design_style}</div></div></Link>)}</div></section>
  </div>;
}
