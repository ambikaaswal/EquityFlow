import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";
import axios from "axios";


const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL
  const {user} = useUser();

  let handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  let handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async()=>{
  try {
    await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
    window.location.href = `${FRONTEND_URL}/login`;
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
  const menuclass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo_blue.png" style={{ width: "100px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu == 0 ? activeMenuClass : menuclass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu == 1 ? activeMenuClass : menuclass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu == 2 ? activeMenuClass : menuclass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu == 3 ? activeMenuClass : menuclass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu == 4 ? activeMenuClass : menuclass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectedMenu == 5 ? activeMenuClass : menuclass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">
            {user.username.slice(0,2).toUpperCase()}
          </div>
          <p className="username">
            {user.username}
          </p>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
