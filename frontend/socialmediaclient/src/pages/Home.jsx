import React from 'react';
import Feed from "../components/Feed";
import Navbar from '../components/Navbar';
import "./home.css";

export default function Home() {
  React.useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);
  return (
    <div className="home_container">
      <Navbar />
      <Feed />
    </div>
  );
}
