
import "./navbar.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from "../features/auth";
import { useDispatch } from "react-redux";

export default function Navbar() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout= () =>{
    dispatch(logout())
    navigate("/", { replace: true })
  }
  return (
    <div className="navbar">
        <p style={{marginLeft: "0.5rem"}} className="name">Social Connection</p>
        <div class = "options">
          <span className="inbox"><button className="buttoni"><InboxIcon></InboxIcon>Inbox</button></span>
          <span className="profile"><button className="buttonp" onClick={navigate("/profile")}><AccountCircleIcon></AccountCircleIcon>Profile</button></span>
          <span className="signOut"><button className="signOutButton" onClick={handleLogout()}><ExitToAppIcon></ExitToAppIcon>Logout</button></span>
        </div>
    </div>
  );











  
}