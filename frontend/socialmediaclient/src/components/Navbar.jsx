import "./navbar.css";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/home">Social Connection</Link>
      </h1>
      <ul className="main-nav">
        <li className="sym">
          <Link>
            <InboxRoundedIcon className="icon"></InboxRoundedIcon>
          </Link>
        </li>
        <li className="sym">
          <Link to="/profile">
            <AccountCircleRoundedIcon className="icon"></AccountCircleRoundedIcon>
          </Link>
        </li>
        <li>
          <Button
            variant="outlined"
            className="signOutButton"
            style={{ color: "white", borderColor: "white" }}
            onClick={handleLogout}
          >
            Sign Out{" "}
          </Button>
        </li>
      </ul>
    </header>
  );
}
