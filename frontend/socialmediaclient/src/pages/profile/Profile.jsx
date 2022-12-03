import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React from 'react';
import { useSelector } from "react-redux";
import AuthorPosts from "../../components/AuthorPosts";
import Navbar from "../../components/Navbar";
import "./Profile.css";






export default function Profile() {

  const state = useSelector((state) => state);
  const [req, setReq] = React.useState(false);
  const ProfilePhoto = state.auth.author.profileImage;
  const Username = state.auth.author.displayName;


  return (
    <>
      <Navbar />
      <div className="profileCover">
        <img
          className="profileCoverImg"
          src={process.env.PUBLIC_URL + "/images/CoverPhoto.jpg"}
          alt=""
        />
        <img className="profilePhoto" src={ProfilePhoto} alt="" />
      </div>
      <div className="profileInfo">
        <div className='nameAdd'>
          <h4 className="profileName">{Username} </h4>
          {/* {req ?
            <PersonAddIcon color="action" sx={{ fontSize: 30 }} className="addIcon" onClick={() => { setReq(prev => !prev); }} /> : <HowToRegIcon color="action" sx={{ fontSize: 30 }} onClick={() => { setReq(prev => !prev); }} className="addIcon" />
          } */}
        </div>
        <span className="profileDescription">Welcome to my profile! </span>
      </div>
      <AuthorPosts />
    </>
  );
}