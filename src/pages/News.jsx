import { useState, useEffect } from 'react';
import { newsApi } from '../services/api';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsApi.getAll({
        params: { page: currentPage, limit: 6 }
      });
      setNews(response.data.news);
      setTotalPages(response.data.pages);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des actualités');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <section className="page-content">
        <div className="container">
          <div className="loading">Chargement des actualités...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-content">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-content">
      <div className="container">
        <div className="section-title">
          <h2>Actualités sportives</h2>
          <p>Restez informé des dernières nouvelles du monde du sport</p>
        </div>
        
        <div className="news-grid">
          {news.length === 0 ? (
            <div className="no-news">
              <p>Aucune actualité disponible pour le moment.</p>
            </div>
          ) : (
            news.map((item) => (
              <div className="news-card" key={item._id}>
                <div className="card-img">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                    alt={item.title}
                  />
                </div>
                <div className="news-meta">
                  <span>{formatDate(item.publishedAt)}</span>
                  <span className={`category-badge category-${item.category}`}>
                    {item.category}
                  </span>
                </div>
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <p>{item.excerpt || item.content.substring(0, 150)}...</p>
                  <div className="news-footer">
                    <span className="views">{item.views} vues</span>
                    <button className="btn btn-outline read-more">
                      Lire la suite
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span className="page-info">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;