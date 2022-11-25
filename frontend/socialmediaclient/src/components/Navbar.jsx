
import "./navbar.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InboxIcon from '@mui/icons-material/Inbox';

export default function Navbar() {
  return (
    <div className="navbar">
      
        <span class = "name">Social Media App</span>
        <span className="inbox"><button className="buttoni"><InboxIcon></InboxIcon>Inbox</button></span>
        <span className="profile"><button className="buttonp"><AccountCircleIcon></AccountCircleIcon>Profile</button></span>
        </div>
   

   
  );
}