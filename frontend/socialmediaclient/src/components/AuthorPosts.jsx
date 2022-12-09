import React, { useEffect, useState } from "react";
import "../components/feed.css";
import PostOption from "./PostOption";
import Post from "./Post";
import { useDispatch } from "react-redux";
import { getAuthorPosts } from "../features/userposts";
import { useSelector } from "react-redux";

export default function AuthorPosts() {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);

  const authorId = state.auth.author.id;

  useEffect(() => {
    dispatch(getAuthorPosts(authorId));
  }, []);

  return (
    <div className="feed">
      <PostOption />
      {state.userposts.posts.map((p, i) => (
        <Post key={p.id} post={p} comp="profile" index={i} />
      ))}
    </div>
  );
}
