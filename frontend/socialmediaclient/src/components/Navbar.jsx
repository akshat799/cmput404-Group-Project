import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { Button } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth";
import { resetPosts } from "../features/posts";
import { resetUserPosts } from "../features/userposts";
import "./navbar.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";


export default function Navbar() {
  const state = useSelector((state)=> state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logout());
    await dispatch(resetPosts());
    await dispatch(resetUserPosts());
    navigate("/");
  };

  const allRegisteredAuthors = state.auth.allAuthors;
  const currentAuthorName = state.auth.author.displayName;

  const [enteredUsername, setEnteredUsername] = useState("")

  const [isMatch, setisMatch] = useState(false)

  const [dispOption,setdispOption] = useState([])
  const [foreignAuthor, setForeignAuthor] = useState({})

  
  
  const matchUsername = () => {
    console.log("this is called")
    for(let author of allRegisteredAuthors){
      // console.log(author.displayName)
      if(author.displayName == enteredUsername && 
        enteredUsername != '' && 
        enteredUsername != currentAuthorName){
        setisMatch(true)
        setForeignAuthor(author)
        setdispOption([enteredUsername])
        console.log("Here is: "+ dispOption[0])
      }
    }
  } 

  useEffect(() => {
    const timer = setTimeout(()=> {
      matchUsername()
      console.log(enteredUsername)
    },500)

    return () => clearTimeout(timer)
  }, [enteredUsername]);
  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/home">Social Connection</Link>
      </h1>
      <div style={{ display: "flex" }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={dispOption}
          onChange={(event, value) => {
            console.log(foreignAuthor)
            navigate("/pprofile", {state:{id: 1, foreignAuthor: {foreignAuthor}}});
            window.location.reload(true)
          }}
          sx={{ width: 300, borderRadius: '10px', background: 'white' }}
          renderInput={(params) => <TextField {...params} onChange={(event) => { setEnteredUsername(event.target.value)}} placeholder="search🔍" />} 
          />
      </div>

      <ul className="main-nav">
        <li className="sym">
          <Link to="/inbox">
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
