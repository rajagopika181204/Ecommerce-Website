import React, { useContext,useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [isCartRestored, setIsCartRestored] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
    if (cartItems.length > 0) {
      setIsCartRestored(true);
      setTimeout(() => setIsCartRestored(false), 3000); // Hide message after 3 seconds
    }
  }, [cartItems.length]);
  // Calculate Total Price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Navigate to BuyNowPage for individual product
  const handleBuyNow = (item) => {
    navigate("/buy-now", {
      state: { product: item.product, quantity: item.quantity },
    });
  };

  // Handle Buy All Functionality
  const handleBuyAll = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add products to proceed.");
      return;
    }

    navigate("/buy-now", {
      state: {
        cartDetails: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        totalPrice,
      },
    });
  };

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

      {/* Cart Content */}
      <div style={styles.content}>
          {/* Cart */}
      {isCartRestored && (
        <div style={styles.alert}>Cart restored successfully!</div>
      )}
        <h1 style={styles.heading}>My Cart 🛒</h1>
        {cartItems.length === 0 ? (
          <p style={styles.emptyMessage}>
            Your cart is empty. Start adding some products!
          </p>
        ) : (
          <div style={styles.cartItemsContainer}>
            {cartItems.map((item, index) => (
              <div key={index} style={styles.cartItem}>
                <div style={styles.imageContainer}>
                  <img
                    src={`http://localhost:3000/images/${item.product.image_url}`}
                    alt={item.product.name}
                    style={styles.productImage}
                  />
                </div>
                <div style={styles.itemDetails}>
                  <h2 style={styles.itemName}>{item.product.name}</h2>
                  <p style={styles.itemQuantity}>
                    Quantity: <strong>{item.quantity}</strong>
                  </p>
                  <p style={styles.itemPrice}>
                    Price: ₹{item.product.price * item.quantity}
                  </p>
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleBuyNow(item)}
                    style={styles.buyNowButton}
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total Price Section */}
            <div style={styles.totalPrice}>Total Price: ₹{totalPrice}</div>

            {/* Actions */}
            <div style={styles.actionsContainer}>
              <button style={styles.buyAllButton} onClick={handleBuyAll}>
                Buy All
              </button>
              <button style={styles.clearCartButton} onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    paddingBottom: "50px",
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
    gap: "15px",
  },
  navButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: "5px 33px",
  },
  content: {
    padding: "20px",
    marginTop: "80px",
  },
  heading: {
    color: "black",
    textAlign: "center",
    marginBottom: "20px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#555",
  },
  cartItemsContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  cartItem: {
    color: "blue",
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  imageContainer: {
    flex: 1,
    textAlign: "center",
  },
  productImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  itemDetails: {
    flex: 3,
    padding: "0 15px",
  },
  itemName: {
    fontSize: "18px",
    margin: "0 0 5px 0",
  },
  itemQuantity: {
    margin: "5px 0",
  },
  itemPrice: {
    color: "blue",
    margin: "5px 0",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  alert: {
    backgroundColor: "#4CAF50",
    color: "white",
    textAlign: "center",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  buyNowButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  totalPrice: {
    textAlign: "right",
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "black",
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  buyAllButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  clearCartButton: {
    padding: "10px 20px",
    backgroundColor: "#FF0000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CartPage;
