import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { FaStar } from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  // Fetch product data
  useEffect(() => {
    axios.get("http://localhost:5000/products").then((res) => {
      const found = res.data.find((p) => p.id === parseInt(id));
      setProduct(found);
    });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.leftSection}>
          <h1 style={styles.storeName}>Tech Gadgets Store</h1>
        </div>
        <div style={styles.rightSection}>
          <button style={styles.navButton} onClick={() => navigate("/")}>
            Home
          </button>
          <button style={styles.navButton} onClick={() => navigate("/products")}>
            Products
          </button>
          <button style={styles.navButton} onClick={() => navigate("/cart")}>
            Cart
          </button>
        </div>
      </nav>

      {/* Product Details */}
      <div style={{ ...styles.productCard, marginTop: "100px" }}>
        {/* Image Section */}
        <div style={styles.imageSection}>
          <img
            src={`http://localhost:3000/images/${product.image_url}`}
            alt={product.name}
            style={styles.productImage}
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Details Section */}
        <div style={styles.detailsSection}>
          <h2 style={styles.productName}>{product.name}</h2>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.price}>Price: ₹{product.price}</p>
          <p
            style={{
              ...styles.stockIndicator,
              color: product.quantity > 0 ? "#4CAF50" : "#FF0000",
            }}
          >
            {product.quantity > 0
              ? `In Stock (${product.quantity} available)`
              : "Out of Stock"}
          </p>

          {/* Quantity Selector */}
          <div style={styles.quantitySelector}>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              max={product.quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={styles.quantityInput}
            />
          </div>

          {/* Rating Section */}
          <div style={styles.ratingContainer}>
            <p style={styles.ratingLabel}>Rate this product:</p>
            <div>
              {[...Array(5)].map((_, index) => {
                const value = index + 1;
                return (
                  <FaStar
                    key={value}
                    size={24}
                    color={value <= (hoverRating || rating) ? "#FFD700" : "#ddd"}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={styles.star}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              style={styles.addToCartButton}
              onClick={() => {
                addToCart(product, parseInt(quantity));
                alert("Added to cart!");
              }}
            >
              Add to Cart
            </button>
            <button
              style={styles.buyNowButton}
              onClick={() =>
                navigate("/buy-now", { state: { product, quantity: parseInt(quantity) } })
              }
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {isModalOpen && (
        <div style={styles.modal} onClick={() => setIsModalOpen(false)}>
          <img
            src={`http://localhost:3000/images/${product.image_url}`}
            alt={product.name}
            style={styles.modalImage}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E74C3C",
    color: "#FFFFFF",
    padding: "10px 20px",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  storeName: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  },
    rightSection: {
    display: "flex",
    gap: "5px", // Reduced gap to save space
    justifyContent: "flex-end", // Align buttons to the right
    flexWrap: "nowrap", // Prevent wrapping to a new line
  },

   navButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    padding:"10px 35px",
  },
  productCard: {
    display: "flex",
    maxWidth: "1000px",
    margin: "20px auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  imageSection: {
    flex: 3,
    padding: "30px",
    textAlign: "center",
  },
  productImage: {
    width: "100%",
    height: "auto",
    cursor: "pointer",
    borderRadius: "8px",
    objectFit: "cover",
  },
  detailsSection: {
    flex: 2,
    padding: "20px",
  },
  productName: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  description: {
    color: "#555",
    marginBottom: "10px",
    fontSize:"20px",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  stockIndicator: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  quantitySelector: {
    marginBottom: "20px",
  },
  quantityInput: {
    padding: "5px",
    width: "60px",
    textAlign: "center",
    marginLeft: "10px",
  },
  ratingContainer: {
    marginBottom: "20px",
  },
  ratingLabel: {
    marginBottom: "10px",
  },
  star: {
    cursor: "pointer",
    margin: "0 5px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  addToCartButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buyNowButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  },
};

export default ProductDetails;
