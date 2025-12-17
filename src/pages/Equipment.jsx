import { useState, useEffect } from 'react';
import { equipmentApi } from '../services/api';
import './Equipment.css';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, [selectedCategory, sortBy, minPrice, maxPrice, brandFilter]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortBy,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        brand: brandFilter || undefined
      };
      
      const response = await equipmentApi.getAll({ params });
      setEquipment(response.data.equipment);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des équipements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await equipmentApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories', err);
    }
  };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Vérifier si l'article est déjà dans le panier
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...item,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} a été ajouté au panier !`);
  };

  const handleBuyNow = (item) => {
    handleAddToCart(item);
    // Rediriger vers la page de paiement (à implémenter)
    // navigate('/checkout');
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSortBy('name');
    setMinPrice('');
    setMaxPrice('');
    setBrandFilter('');
  };

  if (loading) {
    return (
      <section className="page-content">
        <div className="container">
          <div className="loading">Chargement des équipements...</div>
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
          <h2>Équipements sportifs</h2>
          <p>Découvrez notre sélection d'équipements de qualité</p>
        </div>

        <div className="equipment-filters">
          <div className="filter-section">
            <h3>Catégories</h3>
            <div className="categories">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Tous
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Filtres avancés</h3>
            <div className="advanced-filters">
              <div className="filter-group">
                <label htmlFor="sort">Trier par:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                >
                  <option value="name">Nom (A-Z)</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Plus récent</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Prix:</label>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    className="price-input"
                  />
                  <span>à</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    className="price-input"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="brand">Marque:</label>
                <input
                  type="text"
                  id="brand"
                  placeholder="Rechercher par marque"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="form-input"
                />
              </div>

              <button className="btn btn-outline reset-btn" onClick={resetFilters}>
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <div className="equipment-grid">
          {equipment.length === 0 ? (
            <div className="no-equipment">
              <p>Aucun équipement trouvé avec ces critères.</p>
              <button className="btn" onClick={resetFilters}>
                Voir tous les équipements
              </button>
            </div>
          ) : (
            equipment.map((item) => (
              <div className="equipment-card" key={item._id}>
                <div className="equipment-badge">
                  {!item.isAvailable && (
                    <span className="badge unavailable">Indisponible</span>
                  )}
                  {item.stock < 10 && item.stock > 0 && (
                    <span className="badge low-stock">Stock faible</span>
                  )}
                </div>
                <div className="equipment-img">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                    alt={item.name}
                  />
                </div>
                <div className="equipment-info">
                  <div className="equipment-category">{item.category}</div>
                  <h3>{item.name}</h3>
                  <p className="equipment-description">{item.description}</p>
                  
                  {item.brand && (
                    <div className="equipment-brand">
                      <strong>Marque:</strong> {item.brand}
                    </div>
                  )}
                  
                  {item.specifications && (
                    <div className="equipment-specs">
                      {item.specifications.color && (
                        <span className="spec">Couleur: {item.specifications.color}</span>
                      )}
                      {item.specifications.size && (
                        <span className="spec">Taille: {item.specifications.size}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="equipment-footer">
                    <div className="price-stock">
                      <div className="equipment-price">{item.price.toFixed(2)}€</div>
                      <div className={`equipment-stock ${item.stock === 0 ? 'out-of-stock' : ''}`}>
                        {item.stock === 0 ? 'Rupture de stock' : `${item.stock} en stock`}
                      </div>
                    </div>
                    <div className="equipment-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => {/* Voir détails */}}
                      >
                        Détails
                      </button>
                      <button
                        className="btn add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.isAvailable || item.stock === 0}
                      >
                        <i className="fas fa-shopping-cart">🛒</i> Panier
                      </button>
                      <button
                        className="btn buy-now-btn"
                        onClick={() => handleBuyNow(item)}
                        disabled={!item.isAvailable || item.stock === 0}
                      >
                        Acheter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Equipment;