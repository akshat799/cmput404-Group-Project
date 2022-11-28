import React, { useEffect, useState } from "react";
import "./AuthorPosts.css";
import PostOption from "./PostOption";
import Post from "./Post";
import { useDispatch } from "react-redux";
import { getPublicPosts } from "../features/posts";
import { useStore } from "react-redux";

export default function AuthorPosts() {
  const dispatch = useDispatch();

  const store = useStore()
  const state = store.getState()

  const authorId = state.auth.author.id
  // const authorId = state.auth.author.id.split("/")[-1]

  useEffect(() => {
    dispatch(getPublicPosts(authorId));
  }, []);

  return (
    <div className="authorPosts">
      <PostOption />
      {console.log(state.posts.posts)}
      {state.posts.posts.map((p) => (
        <Post key={p.id} post={p} />
      ))}
    </div>
  );
}