import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Productlist from "./pages/Productlist";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import BuyNowPage from "./pages/BuyNowPage";
import UPIPaymentPage from "./pages/UPIPaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import BillingPage from "./pages/BillingPage";
//import TrackingDetailsPage from "./pages/TrackingDetailsPage";
import AboutPage from "./pages/About";
import TrackingPage from"./pages/TrackingPage";
import Wishlist from "./pages/Wishlist";
import OrderHistoryPage from "./pages/OrderHistoryPage";


function AppWrapper() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Productlist />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Productlist />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/buy-now" element={<BuyNowPage />} />
        <Route path="/upi-payment" element={<UPIPaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/tracking" element={<TrackingPage/>} />
        <Route path="/About" element={<AboutPage/>} />
        <Route path="/Wishlist" element={<Wishlist/>} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppWrapper />
      </Router>
    </CartProvider>
  );
}

export default App;
