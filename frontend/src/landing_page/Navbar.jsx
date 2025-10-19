import Cookies from "js-cookie";//to know logged in status
import { useEffect, useState } from "react";
import './Navbar.css'
import { Link } from 'react-router-dom';


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  },[]);

  return (
    <nav className="navbar navbar-expand-lg border-bottom py-1">
      <div className="container-fluid px-5">
        <Link className="navbar-brand w-25 h-auto" to="/">
          <img src="images/Eflow-Logo.svg" alt="unable to load" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-list-ul"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                Signup
              </Link>
            </li>
            <li className="nav-item">
              {!isLoggedIn &&<Link className="nav-link" to="/login">
                login
              </Link>}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/howitworks">
                How it works
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">
                Support
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
