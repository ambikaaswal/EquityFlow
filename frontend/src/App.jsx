import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { Routes, Route } from "react-router-dom";
import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/user/Signup";
import Login from "./landing_page/user/Login";
import AboutPage from "./landing_page/About/AboutPage";
import HowItWorks from "./landing_page/How_it_works/HowItWorks";
import SupportPage from "./landing_page/support/SupportPage";
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";
import NotFound from "./landing_page/NotFound";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
