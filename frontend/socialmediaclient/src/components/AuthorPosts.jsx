import React, { useEffect, useState } from "react";
import "./AuthorPosts.css";
import PostOption from "./PostOption";
import Post from "./Post";
import { useDispatch } from "react-redux";
import { getAuthorPosts } from "../features/userposts";
import { useSelector } from "react-redux";

export default function AuthorPosts() {
  const dispatch = useDispatch();

  let state = useSelector((state) => state);

  const authorId = state.auth.author.id

  useEffect(() => {
    dispatch(getAuthorPosts(authorId));
  }, []);

  return (
    <div className="authorPosts">
      <PostOption />
      {state.userposts.posts.map((p) => (
        <Post key={p.id} post={p} comp="profile"/>
      ))}
    </div>
  );
}