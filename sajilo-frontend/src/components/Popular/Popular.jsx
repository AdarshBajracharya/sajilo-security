import React, { useEffect, useState } from 'react';
import './Popular.css';
import { getPopularProductsApi } from '../../apis/Api';
import Item from '../Item/Item';

const Popular = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]); // Adjust max price as needed
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    getPopularProductsApi()
      .then((res) => {
        const allProducts = res.data.products;
        setProducts(allProducts);
        setMaxPrice(Math.ceil(Math.max(...allProducts.map(p => p.price))));
        setPriceRange([0, Math.ceil(Math.max(...allProducts.map(p => p.price)))]);
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  }, []);

  useEffect(() => {
    let temp = [...products];

    // Filter by search
    if (searchTerm.trim() !== '') {
      temp = temp.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    temp = temp.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort products
    if (sortBy === 'newest') {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'priceLow') {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      temp.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(temp);
  }, [products, searchTerm, sortBy, priceRange]);

  // Handle price slider change
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    const name = e.target.name;
    setPriceRange(prev => name === 'min' ? [value, prev[1]] : [prev[0], value]);
  };

  return (
    <section className="popular" aria-label="All products">
      <div className="popular-header">
        <h1>PRODUCTS</h1>
        <div className="underline"></div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="sort-select">
          <label htmlFor="sortBy">Sort by:</label>
          <select id="sortBy" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        <div className="price-range">
          <label>Price Range:</label>
          <div className="price-sliders">
            <input
              type="range"
              min="0"
              max={maxPrice}
              name="min"
              value={priceRange[0]}
              onChange={handlePriceChange}
            />
            <input
              type="range"
              min="0"
              max={maxPrice}
              name="max"
              value={priceRange[1]}
              onChange={handlePriceChange}
            />
          </div>
          <div className="price-values">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="popular-list" role="list">
        {filteredProducts.length === 0 ? (
          <p className="no-results">No products found.</p>
        ) : (
          filteredProducts.map(item => (
            <Item
              key={item._id}
              id={item._id}
              name={item.title}
              image={item.imageUrl}
              price={item.price}
              description={item.description}
              category={item.category}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Popular;
