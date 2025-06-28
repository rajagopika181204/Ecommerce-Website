import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaShoppingCart,
  FaHome,
  FaProductHunt,
  FaArrowLeft,
} from "react-icons/fa";

function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [isCartRestored, setIsCartRestored] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length > 0) {
      setIsCartRestored(true);
      setTimeout(() => setIsCartRestored(false), 3000);
    }
  }, [cartItems.length]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleBuyNow = (item) => {
    navigate("/buy-now", {
      state: { product: item.product, quantity: item.quantity },
    });
  };

  const handleBuyAll = () => {
    if (cartItems.length === 0) {
      toast.success("Your cart is empty. Add products to proceed.");
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
   
    <div className="font-sans bg-pink-50 min-h-screen pb-12">
      <nav className="bg-pink-500 text-white py-4 px-6 shadow-lg fixed top-0 left-0 w-full z-50 flex justify-between items-center">
        <ToastContainer/>
        <div className="flex items-center gap-4">
          <button
            className="text-xl hover:text-gray-200"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Tech Gadgets Store</h1>
        </div>
        <div className="flex space-x-6">
          <button
            className="flex items-center gap-2 text-lg hover:text-gray-200"
            onClick={() => navigate("/")}
          >
            <FaHome /> Home
          </button>
          <button
            className="flex items-center gap-2 text-lg hover:text-gray-200"
            onClick={() => navigate("/products")}
          >
            <FaProductHunt /> Products
          </button>
          <button
            className="flex items-center gap-2 text-lg hover:text-gray-200"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart /> Cart
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24">
        {isCartRestored && (
          <div className="bg-green-500 text-white text-center py-3 rounded-lg mb-4">
            Cart restored successfully!
          </div>
        )}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Cart 🛒
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your cart is empty. Start adding some products!
          </p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center border border-gray-200 rounded-lg p-4 gap-4 shadow-lg"
                >
                  <img
                    src={`http://localhost:3000/images/${item.product.image_url}`}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-600">
                      Quantity: <strong>{item.quantity}</strong>
                    </p>
                    <p className="text-pink-500 font-bold">
                      Price: ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right text-xl font-semibold text-gray-800 mt-6">
              Total Price: <span className="text-pink-500">₹{totalPrice}</span>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBuyAll}
                className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600"
              >
                Buy All
              </button>
              <button
                onClick={clearCart}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
