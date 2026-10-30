import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import SearchBar from './components/SearchBar';
import AuthModal from './pages/AuthModal';
import HomePage from './pages/HomePage';
import ArticleArchivePage from './pages/ArticleArchivePage';
import TrendsPage from './pages/TrendsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import DesignersPage from './pages/DesignersPage';
import DesignerDetailPage from './pages/DesignerDetailPage';
import CollectionsPage from './pages/CollectionsPage';
import StreetStylePage from './pages/StreetStylePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import InfoPage from './pages/InfoPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="site-shell">
          <Header />
          <main className="site-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/trends/:slug" element={<TrendsPage />} />
              <Route path="/articles" element={<ArticleArchivePage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/designers" element={<DesignersPage />} />
              <Route path="/designers/:id" element={<DesignerDetailPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/street-style" element={<StreetStylePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<InfoPage type="about" />} />
              <Route path="/contact" element={<InfoPage type="contact" />} />
              <Route path="/privacy" element={<InfoPage type="privacy" />} />
              <Route path="/terms" element={<InfoPage type="terms" />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <SearchBar />
          <AuthModal />
          <Toast />
        </div>
      </Router>
    </AuthProvider>
  );
}
