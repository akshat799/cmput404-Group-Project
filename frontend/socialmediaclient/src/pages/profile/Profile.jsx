import "./Profile.css"
import AuthorPosts from "../../components/AuthorPosts";
import Navbar from "../../components/Navbar";
import { Users } from "../../dummy";




export default function Profile() {
    const ProfilePhoto = process.env.PUBLIC_URL + '/images/ProfileIcon.png'
    const Username = 'Justin Bieber'
    return(
        <>
        <Navbar />
        <div className="profileCover">
                <img className="profileCoverImg" src= {process.env.PUBLIC_URL + '/images/CoverPhoto.jpg'} alt=""/>
                <img className="profilePhoto" src={ProfilePhoto} alt=""/>
        </div>
        <div className="profileInfo" >
                <h4 className="profileName">{Username}</h4>
                <span className="profileDescription">Welcome to my profile! </span>
        </div>
        <AuthorPosts/>
        </>
    

    )
}