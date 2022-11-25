import "./Profile.css"
import AuthorPosts from "../../components/AuthorPosts";
import Navbar from "../../components/Navbar";
import { useStore } from "react-redux";

export default function Profile() {

  const store = useStore()
  const state = store.getState()

  const ProfilePhoto = state.auth.author.profileImage
  const Username = state.auth.author.displayName
  
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
        <h4 className="profileName">{Username}</h4>
        <span className="profileDescription">Welcome to my profile! </span>
      </div>
      <AuthorPosts />
    </>
  );
}