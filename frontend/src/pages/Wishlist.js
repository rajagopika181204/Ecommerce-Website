import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import "./Wishlist.css";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    // Retrieve wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const Navigate = useNavigate();

  useEffect(() => {
    // Fetch all products from API
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const removeFromWishlist = (productId) => {
    // Update the wishlist state and localStorage
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <div>
      <header className="navbar">
        <div className="navbar-brand">
          <Link to="/">
            <img
              src="/images/logo.jpeg"
              alt="Tech Gadgets Store"
              className="navbar-logo-circle"
            />
          </Link>
          <span className="navbar-title">Tech Gadgets Store</span>
        </div>
        <nav className="navbar-links">
          <Link to="/about">About</Link>
          <Link to="/products">Home</Link>
          <Link to="/cart">Cart 🛒</Link>
        </nav>
      </header>

      <main className="wishlist-section">
        <center><h1 className="h1">Your Wishlist</h1></center>
        <div className="wishlist-grid">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <div key={product.id} className="wishlist-card">
                <img
                  src={`http://localhost:3000/images/${product.image_url}`}
                  alt={product.name}
                  className="wishlist-image"
                  onClick={() => Navigate(`/products/${product.id}`)}
                />
                <div className="wishlist-info">
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                  <br/>
                  <button
                    className="remove-button"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Your wishlist is empty. Start adding items!</p>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Tech Gadgets Store. All rights reserved.</p>
        <div>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{" "}
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export default Wishlist;
