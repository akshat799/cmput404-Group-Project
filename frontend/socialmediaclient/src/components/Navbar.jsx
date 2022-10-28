
import "./navbar.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InboxIcon from '@mui/icons-material/Inbox';

export default function Navbar() {
  return (
    <div className="navbar">
        <p style={{marginLeft: "0.5rem"}} className="name">Social Connection</p>
        <div class = "options">
          <span className="inbox"><button className="buttoni"><InboxIcon></InboxIcon>Inbox</button></span>
          <span className="profile"><button className="buttonp"><AccountCircleIcon></AccountCircleIcon>Profile</button></span>
        </div>
    </div>
  );
}