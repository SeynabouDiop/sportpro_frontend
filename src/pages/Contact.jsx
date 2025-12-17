import { useState } from 'react';
import { contactApi } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await contactApi.sendMessage(formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <section className="page-content">
      <div className="container">
        <div className="section-title">
          <h2>Contactez-nous</h2>
          <p>N'hésitez pas à nous contacter pour toute question ou information</p>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt">📍</i>
              </div>
              <div className="contact-details">
                <h3>Adresse</h3>
                <p>123 Avenue du Sport<br />75000 Paris, France</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone">📞</i>
              </div>
              <div className="contact-details">
                <h3>Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope">✉️</i>
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>contact@sportpro.fr</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-clock">🕒</i>
              </div>
              <div className="contact-details">
                <h3>Horaires d'ouverture</h3>
                <p>Lundi - Vendredi: 7h - 22h<br />Samedi - Dimanche: 8h - 20h</p>
              </div>
            </div>

            <div className="contact-map">
              <div className="map-placeholder">
                <div className="map-overlay">
                  <h4>Notre complexe sportif</h4>
                  <p>Venez nous rendre visite !</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle">✅</i>
                <p>Votre message a été envoyé avec succès !<br />Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle">❌</i>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Nom complet <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Sujet <span className="required">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="information">Demande d'information</option>
                    <option value="inscription">Inscription</option>
                    <option value="equipment">Équipements</option>
                    <option value="event">Événements</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="6"
                  placeholder="Votre message..."
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;