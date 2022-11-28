import React from 'react'
import Feed from "../components/Feed"
import Navbar from '../components/Navbar';
import "./home.css"

export default function Home() {
  return (
 
    <div className="home_container">
        <Navbar/>
        <Feed />
        
    </div>
    
  );
}
