import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Status from "./pages/Status";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </BrowserRouter>
    </Elements>
  );
};

export default App;
