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

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logout());
    await dispatch(resetPosts());
    await dispatch(resetUserPosts());
    navigate("/");
  };
  const suggestionsSearch = [
    "user 1",
    "user 2",
    "user 3",
    "user 4",
    "user 5",
    "user 6",
    "user 7",
    "user 8",
    "user 9",
    "user 10",
    "user 11",
    "user 12",
  ];

  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/home">Social Connection</Link>
      </h1>
      <div style={{ display: "flex" }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={suggestionsSearch}
          onChange={(event, value) => {
            console.log(value);
            navigate("/pprofile");
          }}
          sx={{ width: 300, borderRadius: "10px", background: "white" }}
          renderInput={(params) => (
            <TextField {...params} placeholder="search 🔍" />
          )}
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
