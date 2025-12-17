import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Bienvenue dans l'univers du sport</h1>
          <p>Découvrez les dernières actualités, événements et équipements pour pratiquer votre sport favori dans les meilleures conditions.</p>
          <Link to="/actualites" className="btn">Voir les actualités</Link>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-title">
            <h2>Sports populaires</h2>
            <p>Explorez nos différentes disciplines sportives et trouvez celle qui vous correspond</p>
          </div>
          <div className="cards-grid">
            <div className="card">
              <div className="card-img">
                <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Football" />
              </div>
              <div className="card-content">
                <h3>Football</h3>
                <p>Rejoignez nos équipes de football amateur et professionnel. Entraînements hebdomadaires et compétitions.</p>
                <button className="btn btn-outline">En savoir plus</button>
              </div>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Basketball" />
              </div>
              <div className="card-content">
                <h3>Basketball</h3>
                <p>Participez à nos sessions de basketball en salle et en extérieur. Pour tous les niveaux.</p>
                <button className="btn btn-outline">En savoir plus</button>
              </div>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Tennis" />
              </div>
              <div className="card-content">
                <h3>Tennis</h3>
                <p>Profitez de nos courts de tennis et de nos coachs professionnels pour améliorer votre jeu.</p>
                <button className="btn btn-outline">En savoir plus</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;