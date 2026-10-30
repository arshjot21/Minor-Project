import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await api.subscribeNewsletter(email); setMessage('You are on the list.'); setEmail(''); }
    catch (err) { setMessage(err.message || 'Please try again.'); }
  };
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="newsletter" style={{marginBottom:60}}>
          <div>
            <div className="eyebrow" style={{color:'#aaa39a'}}>THE FD EDIT / WEEKLY</div>
            <h2>One thoughtful fashion letter.</h2>
          </div>
          <div>
            <p>Runway notes, designer profiles, emerging movements and useful fashion references, edited for students, designers and curious readers.</p>
            <form className="newsletter-form" onSubmit={submit}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required />
              <button>Subscribe</button>
            </form>
            {message && <p style={{marginTop:12}}>{message}</p>}
          </div>
        </div>

        <div className="footer-top">
          <div><div className="footer-brand">FD<br/>TREND</div><p className="footer-note">A fashion design journal and discovery platform created as a minor project with an editorial point of view.</p></div>
          <div><div className="footer-heading">Explore</div><div className="footer-links"><Link to="/trends">Trends</Link><Link to="/designers">Designers</Link><Link to="/collections">Collections</Link><Link to="/street-style">Street File</Link></div></div>
          <div><div className="footer-heading">Journal</div><div className="footer-links"><Link to="/articles?category=Fashion">Fashion</Link><Link to="/articles?category=Beauty">Beauty</Link><Link to="/articles?category=Culture">Culture</Link><Link to="/about">About</Link></div></div>
          <div><div className="footer-heading">Project</div><div className="footer-links"><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/admin">Admin</Link></div></div>
        </div>
        <div className="footer-bottom"><span>FD TREND / FASHION DESIGN EDITORIAL</span><span>Built as a full-stack academic project</span></div>
      </div>
    </footer>
  );
}
