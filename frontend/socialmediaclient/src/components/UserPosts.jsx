import React, { useEffect, useState } from "react";
import "../components/feed.css";
import Post from "./Post";
import { useDispatch } from "react-redux";
import { getForeignAuthorPosts } from "../features/posts";

export default function UserPosts(authorId) {
  const dispatch = useDispatch();


  const [res, setRes] = useState();

  const getPosts = async() => {
    const res = await dispatch(getForeignAuthorPosts(authorId.authorId))
    setRes(res)
  }
  useEffect(() => {
    getPosts()
  }, []);

  return (
    <div className="feed">
       {res?.data.map((p,i) => ( 
        <Post key={p.id} post={p} comp="profile" index={i} /> 
        ))}
    </div>
  );
}
