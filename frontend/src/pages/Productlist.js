import React, { useEffect, useState ,useContext} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaSearch, FaUser } from "react-icons/fa";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./ProductList.css";
import { FaShoppingCart } from "react-icons/fa";
import { UserContext } from '../context/UserContext';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);
  const Navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
   // Navigate to login if not logged in
  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <img
            src="/images/logo.jpeg"
            alt="Tech Gadgets Store"
            className="navbar-logo-circle"
          />
          <span className="navbar-title">Tech Gadgets Store</span>
        </div>
        <nav className="navbar-links">
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          <Link to="/wishlist">Wishlist ❤️</Link>
          <Link to="/cart">Cart <FaShoppingCart /></Link>
          {user ? (
            <>
              <Link to="/profile">My Profile<FaUser/></Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

     <div
  style={{
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
  }}
>
  <FaSearch
    style={{
      position: "absolute",
      left: "10px",
      color: "#888",
      fontSize: "20px",
    }}
  />
  <input
    type="text"
    placeholder="Search for products, brands, and more..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      width: "100%",
      padding: "10px 10px 10px 35px", // Add left padding to accommodate the icon
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      outline: "none",
      color: "black",
      backgroundColor: "#fff",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    }}
  />
</div>


      {/* Shop Section */}
      <div className="shop-section">
        <h1>Explore Our Latest Tech Gadgets!</h1>
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`http://localhost:3000/images/${product.image_url}`}
                  alt={product.name}
                  className="product-image"
                  onClick={() => Navigate(`/products/${product.id}`)}
                />
                <div className="product-info">
                  <div className="product-details">
                    <h3>{product.name}</h3>
                  </div>
                  <div className="price-wishlist">
                    <p className="price">₹{product.price}</p>
                    <button
                      className="wishlist-button"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      {wishlist.includes(product.id) ? (
                        <FaHeart className="wishlist-icon active" />
                      ) : (
                        <FaRegHeart className="wishlist-icon" />
                      )}
                    </button>
                  </div>
                  <Link to={`/products/${product.id}`} className="shop-now">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                margin: "20px 0",
                fontSize: "18px",
                color: "#555",
              }}
            >
              No products found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
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

export default ProductList;
