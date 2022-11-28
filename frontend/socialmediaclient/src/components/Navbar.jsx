import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth";
import { useDispatch } from "react-redux";
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';


export default function Navbar() {

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleLogout = async() =>{
    await dispatch(logout())
    navigate("/")
  }
  return (
//     <div className="navbar">
//       	<header class="header">
// 		<h1 class="logo">SOCIAL MEDIA APP</h1>
//       <ul class="main-nav">
//           <li><button className="buttoni"><InboxRoundedIcon></InboxRoundedIcon>Inbox</button></li>
//           <li><button className="buttonp"><AccountCircleRoundedIcon></AccountCircleRoundedIcon>Profile</button></li>
//       </ul>
// 	</header> 

// {/*       
//         <span class = "name">Social Media App </span>
//         <span className="inbox"><button className="buttoni"><InboxRoundedIcon></InboxRoundedIcon>Inbox</button></span>
//         <span className="profile"><button className="buttonp"><AccountCircleRoundedIcon></AccountCircleRoundedIcon>Profile</button></span> */}
//         </div>
   
<header class="header">
<h1 class="logo"><a href="#">SOCIAL MEDIA APP</a></h1>
  <ul class="main-nav">

      <li class ="sym"><a href="#"><InboxRoundedIcon></InboxRoundedIcon></a></li>
      <li class ="sym"><a href="#"><AccountCircleRoundedIcon></AccountCircleRoundedIcon></a></li>
  </ul>
</header> 

   
  );











  
}