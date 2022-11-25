import "./navbar.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from "../features/auth";
import { useDispatch } from "react-redux";

export default function Navbar() {

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleLogout = async() =>{
    await dispatch(logout())
    navigate("/")
  }
  return (
    <div className="navbar">
      
        <span class = "name">Social Media App</span>
        <span className="inbox"><button className="buttoni"><InboxIcon></InboxIcon>Inbox</button></span>
        <span className="profile"><button className="buttonp"><AccountCircleIcon></AccountCircleIcon>Profile</button></span>
        </div>
   

   
  );











  
}