import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import "../../styles/header.css";
import { logout, THEME } from "../../redux/actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import HomeIcon from "@material-ui/icons/Home";
import TelegramIcon from "@material-ui/icons/Telegram";
import { Link, useLocation } from "react-router-dom";
import ExploreIcon from "@material-ui/icons/Explore";
import NotifyModal from "../NotifyModal";

function Menus() {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { auth, theme, alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navLinks = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Message", icon: <TelegramIcon />, path: "/message" },
    { label: "Discover", icon: <ExploreIcon />, path: "/discover" },
  ];
  
  return (
    <div className="menu">
      <ul className="navbar-nav flex-row">
        {navLinks.map((link, index) => (
          <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
            <Link className="nav-link" to={link.path}>
              <span className="material-icons" style={{ fontSize: "20px" }}>
                {link.icon}
              </span>
            </Link>
          </li>
        ))}

        <li className="nav-item dropdown" style={{ opacity: 1 }}>
          <span
            className="nav-link position-relative"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Badge
              style={{
                position: "relative",
                top: "0.3rem",
                margin: "0 6px",
                filter: theme ? "invert(1)" : "invert(0)",
              }}
              color="error"
              badgeContent={alert.data.length}
            >
              <NotificationsIcon
                style={{ filter: theme ? "invert(1)" : "invert(0)" }}
              />
            </Badge>
          </span>

          <div
            className="dropdown-menu"
            aria-labelledby="navbarDropdown"
            style={{ transform: "translate(20px 50px)" }}
          >
            <NotifyModal />
          </div>
        </li>

        <div className="avatar_profile">
          <Avatar
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            alt="Remy Sharp"
            src={auth.user.avatar}
            className="avatar"
            style={{ filter: `${theme ? "invert(1)" : "invert(0)"}` }}
          />

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link
                style={{
                  textDecoration: "none",
                  position: "relative",
                  left: "1.5rem",
                  color: "black",
                }}
                to={`/profile/${auth.user._id}`}
              >
                Profile
              </Link>
            </MenuItem>
            <MenuItem className="menu_item" onClick={handleClose}>
              {" "}
              <label
                htmlFor="theme"
                className="dropdown-item"
                onClick={() => dispatch({ type: THEME, payload: !theme })}
                style={{ background: "none" }}
              >
                <span style={{ fontSize: "16px" }}>
                  {theme ? "Light mode" : "Dark mode"}
                </span>
              </label>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                style={{
                  textDecoration: "none",
                  position: "relative",
                  left: "1.5rem",
                  textAlign: "center",
                  color: "black",
                }}
                to="/"
                onClick={() => dispatch(logout())}
              >
                Logout
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </ul>
    </div>
  );
}

export default Menus;
