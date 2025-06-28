import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <div className="font-sans bg-pink-50 min-h-screen">
      {/* Navbar */}
      <header className="bg-pink-500 shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img
              src="/images/logo.jpeg"
              alt="Tech Gadgets Store"
              className="w-12 h-12 rounded-full"
            />
          </Link>
          <h1 className="text-xl font-bold text-white">Tech Gadgets Store</h1>
        </div>
        <nav className="flex gap-6">
          <Link
            to="/about"
            className="text-white text-lg font-semibold hover:text-gray-200 transition duration-200"
          >
            About
          </Link>
          <Link
            to="/products"
            className="text-white text-lg font-semibold hover:text-gray-200 transition duration-200 flex items-center gap-2"
          >
            <FaHome /> Home
          </Link>
          <Link
            to="/cart"
            className="text-white text-lg font-semibold hover:text-gray-200 transition duration-200 flex items-center gap-2"
          >
            <FaShoppingCart /> Cart
          </Link>
        </nav>
      </header>

      {/* Wishlist Section */}
      <main className="py-10 px-6">
        <center>
          <h2 className="text-4xl font-bold text-pink-600 mb-8">
            Your Wishlist
          </h2>
        </center>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={`http://localhost:3000/images/${product.image_url}`}
                  alt={product.name}
                  className="w-full h-60 object-cover cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-pink-600 font-bold text-lg mt-2">
                    ₹{product.price}
                  </p>
                  <button
                    className="mt-4 w-full bg-pink-500 text-white py-2 rounded-md flex justify-center items-center gap-2 hover:bg-pink-600 transition duration-200"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg col-span-full">
              Your wishlist is empty. Start adding items!
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md py-6 text-center mt-10">
        <p className="text-gray-600">
          © 2025 Tech Gadgets Store. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link
            to="/"
            className="text-pink-600 hover:text-pink-800 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-pink-600 hover:text-pink-800 transition duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-pink-600 hover:text-pink-800 transition duration-200"
          >
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Wishlist;
