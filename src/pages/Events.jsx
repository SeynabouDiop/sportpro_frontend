import { useState, useEffect } from 'react';
import { eventsApi } from '../services/api';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching events...');
      
      // D'abord testons la connexion
      const response = await eventsApi.getAll();
      console.log('Events API response:', response.data);
      
      if (!response.data || !response.data.events) {
        throw new Error('Format de réponse invalide');
      }
      
      // Filtrer les événements
      let filteredEvents = response.data.events;
      if (filter !== 'all') {
        filteredEvents = response.data.events.filter(event => 
          event.sport && event.sport.toLowerCase() === filter.toLowerCase()
        );
      }
      
      // Trier par date
      filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setEvents(filteredEvents);
      
    } catch (err) {
      console.error('Erreur complète:', err);
      
      // Données mockées en cas d'erreur
      const mockEvents = getMockEvents();
      let filteredMockEvents = mockEvents;
      
      if (filter !== 'all') {
        filteredMockEvents = mockEvents.filter(event => 
          event.sport && event.sport.toLowerCase() === filter.toLowerCase()
        );
      }
      
      setEvents(filteredMockEvents);
      
      if (err.message.includes('Network Error')) {
        setError('Mode démo: données simulées (le serveur n\'est pas disponible)');
      } else {
        setError(`Erreur: ${err.message}. Affichage des données de démo.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Données mockées pour le développement
  const getMockEvents = () => {
    return [
      {
        _id: '1',
        title: 'Tournoi de basketball 3x3',
        description: 'Participez à notre tournoi de basketball 3x3 ouvert à tous les niveaux.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '09:00',
        endTime: '18:00',
        location: 'Terrain extérieur',
        sport: 'basketball',
        maxParticipants: 20,
        currentParticipants: 15,
        price: 0,
        status: 'upcoming'
      },
      {
        _id: '2',
        title: 'Course d\'orientation',
        description: 'Découvrez la course d\'orientation en forêt.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '08:00',
        endTime: '12:00',
        location: 'Forêt de Fontainebleau',
        sport: 'athletics',
        maxParticipants: 30,
        currentParticipants: 22,
        price: 10,
        status: 'upcoming'
      },
      {
        _id: '3',
        title: 'Stage de tennis junior',
        description: 'Stage d\'une semaine pour les jeunes.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '10:00',
        endTime: '16:00',
        location: 'Courts de tennis',
        sport: 'tennis',
        maxParticipants: 15,
        currentParticipants: 12,
        price: 150,
        status: 'upcoming'
      }
    ];
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      return date.toLocaleDateString('fr-FR', options);
    } catch {
      return 'Date indéterminée';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const getStatus = (event) => {
    try {
      if (event.status === 'cancelled') return 'annulé';
      
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) return 'terminé';
      if (eventDate.toDateString() === today.toDateString()) return "aujourd'hui";
      return 'à venir';
    } catch {
      return 'à venir';
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Veuillez vous connecter pour vous inscrire à un événement');
        return;
      }

      const response = await eventsApi.register(eventId);
      alert(response.data.message || 'Inscription réussie !');
      
      // Mettre à jour localement
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, currentParticipants: event.currentParticipants + 1 }
            : event
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchEvents();
  };

  if (loading) {
    return (
      <section className="page-content">
        <div className="container">
          <div className="section-title">
            <h2>Événements à venir</h2>
            <p>Participez à nos prochains événements sportifs</p>
          </div>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des événements...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-content">
      <div className="container">
        <div className="section-title">
          <h2>Événements à venir</h2>
          <p>Participez à nos prochains événements sportifs</p>
        </div>

        {error && (
          <div className="demo-notice">
            <div className="demo-icon">⚠️</div>
            <div className="demo-message">
              <p>{error}</p>
              <button onClick={handleRetry} className="btn btn-small">
                Réessayer la connexion
              </button>
            </div>
          </div>
        )}

        <div className="events-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button 
            className={`filter-btn ${filter === 'football' ? 'active' : ''}`}
            onClick={() => setFilter('football')}
          >
            Football
          </button>
          <button 
            className={`filter-btn ${filter === 'basketball' ? 'active' : ''}`}
            onClick={() => setFilter('basketball')}
          >
            Basketball
          </button>
          <button 
            className={`filter-btn ${filter === 'tennis' ? 'active' : ''}`}
            onClick={() => setFilter('tennis')}
          >
            Tennis
          </button>
          <button 
            className={`filter-btn ${filter === 'fitness' ? 'active' : ''}`}
            onClick={() => setFilter('fitness')}
          >
            Fitness
          </button>
        </div>

        <div className="events-timeline">
          {events.length === 0 ? (
            <div className="no-events">
              <p>Aucun événement trouvé pour cette catégorie.</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="btn"
                >
                  Voir tous les événements
                </button>
              )}
            </div>
          ) : (
            events.map((event) => {
              const status = getStatus(event);
              return (
                <div className="event-item" key={event._id || Math.random()}>
                  <div className="event-date">
                    <div className="day">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="month">
                      {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                    <div className="year">
                      {new Date(event.date).getFullYear()}
                    </div>
                  </div>
                  <div className="event-content">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <span className={`event-status status-${status.replace(' ', '-')}`}>
                        {status}
                      </span>
                    </div>
                    <div className="event-meta">
                      <span className="meta-item">
                        <i className="fas fa-clock">⏰</i>
                        {formatTime(event.startTime)}
                        {event.endTime && ` - ${formatTime(event.endTime)}`}
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-map-marker-alt">📍</i>
                        {event.location}
                      </span>
                      {event.price > 0 && (
                        <span className="meta-item">
                          <i className="fas fa-tag">💰</i>
                          {event.price}€
                        </span>
                      )}
                      <span className="meta-item">
                        <i className="fas fa-basketball-ball">🏀</i>
                        {event.sport}
                      </span>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-footer">
                      <div className="participants">
                        <i className="fas fa-users">👥</i>
                        {event.currentParticipants || 0}
                        {event.maxParticipants && ` / ${event.maxParticipants}`} participants
                      </div>
                      <div className="event-actions">
                        {status === 'à venir' && (
                          <button 
                            className="btn"
                            onClick={() => handleRegister(event._id)}
                            disabled={event.maxParticipants && event.currentParticipants >= event.maxParticipants}
                          >
                            {event.maxParticipants && event.currentParticipants >= event.maxParticipants 
                              ? 'Complet' 
                              : 'S\'inscrire'}
                          </button>
                        )}
                        <button 
                          className="btn btn-outline"
                          onClick={() => alert(`Détails de: ${event.title}`)}
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;