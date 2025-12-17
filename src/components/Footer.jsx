import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>SportPro</h3>
            <p>Votre destination pour tous les sports. Rejoignez notre communauté et vivez votre passion.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f">FB</i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter">TW</i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram">IG</i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube">YT</i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Liens rapides</h3>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/actualites">Actualités</Link></li>
              <li><Link to="/evenements">Événements</Link></li>
              <li><Link to="/equipements">Équipements</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Sports</h3>
            <ul>
              <li><Link to="/sports/football">Football</Link></li>
              <li><Link to="/sports/basketball">Basketball</Link></li>
              <li><Link to="/sports/tennis">Tennis</Link></li>
              <li><Link to="/sports/natation">Natation</Link></li>
              <li><Link to="/sports/athletisme">Athlétisme</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Newsletter</h3>
            <p>Inscrivez-vous pour recevoir nos dernières actualités et offres spéciales.</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Votre email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn newsletter-btn">
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} SportPro. Tous droits réservés.</p>
          </div>
          <div className="footer-links">
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/politique-confidentialite">Politique de confidentialité</Link>
            <Link to="/conditions-generales">Conditions générales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;