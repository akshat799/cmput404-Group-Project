import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React from 'react';
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import "./Pprofile.css";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { checkIfFollower } from '../../features/auth';
import { removeFromfollowers } from '../../features/auth';

import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { sendRequestToFollow } from '../../features/auth';


export default function Pprofile() {

  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const foreignAuthor = location != null ? location.state.foreignAuthor: {};
  const [req, setReq] = React.useState(false);
  const ProfilePhoto = state.auth.author.profileImage;
  const Username = foreignAuthor.foreignAuthor.displayName;
  const foreignAuthorId = foreignAuthor.foreignAuthor.id.split("/").reverse()[0]
  const currentAuthorId = state.auth.author.id

  const [followsAuthor, setFollowsAuthor] = useState(false);
  const [isFollowedByAuthor, setIsFollowedByAuthor ] = useState(false);
  const [requestSent, setRequestSent] = useState(false)

  const currentAuthorfollowers = state.auth.followers

  const checkIfFollowedByAuthor = async() => {
    const resp = await dispatch(checkIfFollower(foreignAuthorId, currentAuthorId))
    if (resp.status == 200){
      if(resp.data === 'IS NOT A FOLLOWER'){
        setIsFollowedByAuthor(false)
      }
      if(resp.data === 'IS A FOLLOWER'){
        setIsFollowedByAuthor(true)
      }
      }
      console.log(resp.data)
    }
  
  const isAFollower = () => {
    for (let follower of currentAuthorfollowers){
      console.log(follower.id, foreignAuthorId)
      if( follower.id === foreignAuthorId){
        setFollowsAuthor(true)
        console.log("followsAuthor"+ true)
        break;
      }
    }
  }
  useEffect(() => {
    isAFollower();
    checkIfFollowedByAuthor();
  }, [followsAuthor, isFollowedByAuthor]);

  const sendFollowRequest = async() => {
    let data ={
      "type": "follow",
      "object": state.auth.author.url,
    }
    const res = await dispatch(sendRequestToFollow(foreignAuthorId, data))
    
    if (res.status == 200){
      setRequestSent(true)
    }
    
  }
  const removeFromForeignFollowers = async() => {
    const res = await dispatch(removeFromfollowers(foreignAuthorId, currentAuthorId))
    if(res.status == 200 || res.status == 204){
      setIsFollowedByAuthor(false)
    }
  }
  const removeFromAuthorFollowers = async() => {
    await dispatch(removeFromfollowers(currentAuthorId, foreignAuthorId))
  }

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

          {/* Add friend/unfollow  */}
          {req ?
            <PersonAddIcon color="action" sx={{ fontSize: 30 }} className="addIcon" onClick={() => { setReq(prev => !prev); }} /> : <HowToRegIcon color="action" sx={{ fontSize: 30 }} onClick={() => { setReq(prev => !prev); }} className="addIcon" />
          }
        </div>
        <span className="profileDescription">Welcome to {Username}'s profile! </span>
        <span style={{marginTop:'20px'}}> 
          {!isFollowedByAuthor && !requestSent && 
            <Button variant="contained" style={{color: "white"}} 
              onClick={()=>sendFollowRequest()}> 
              Send Request </Button>}
          {!isFollowedByAuthor && requestSent && 
            <Button variant="contained" style={{color: "white", background: "darkgray"}} disabled="true"> 
              Request Sent</Button>}
          {isFollowedByAuthor && 
            <Button variant="contained" style={{color: "white"}} 
              onClick={()=>removeFromForeignFollowers()}> 
              UnFollow </Button>}
          {followsAuthor && 
            <Button variant="outlined" style={{color: "white", marginLeft: '20px', background:"gray"}}
              onClick={()=>removeFromAuthorFollowers()}> 
              Remove Follower</Button>}
          
        </span>
      </div>

    </>
  );
}