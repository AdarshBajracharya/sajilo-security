import React from "react";
import "./ProductDisplay.css";
import { useCart } from "../Context/CartContext";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ product: product._id });
    alert(`Added "${product.title}" to cart!`);
  };

  return (
    <div className="product-container">
      {/* Image */}
      <div className="image-wrapper">
        <img
          src={process.env.REACT_APP_BACKEND_IMAGE_URL + product.imageUrl}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="product-details">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">Rs. {product.price.toFixed(2)}</p>
        <p className="product-desc">{product.description}</p>

        {/* Add to Cart Button */}
        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDisplay;
