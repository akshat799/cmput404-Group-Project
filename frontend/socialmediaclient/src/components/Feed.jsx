import React, { useEffect, useState } from "react";
import "./feed.css";
import PostOption from "./PostOption";
import Post from "./Post";
import { useSelector } from "react-redux";
import { getPublicPosts, setLoading } from "../features/posts";
import { useDispatch } from "react-redux";
import { getOwnFollowers } from "../features/auth";
import LoadingSpinner from "./spinner";

export default function Feed() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const authorId = state.auth.author.id;

  const getPosts = async () => {
    await dispatch(getPublicPosts());
    await dispatch(getOwnFollowers(authorId));
    dispatch(setLoading(false));
  };

  useEffect(() => {
    getPosts();
  }, []);

  let arr = state.posts.posts.filter((post, i) => {
    if (
      post.id.split("/").reverse()[0] === "ff3faadc-54d6-4011-a6de-2d77c74c92cd"
    )
      console.log(i);
  });

  return (
    <>
      {state.posts.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="feed">
          <PostOption />
          {state.posts.posts != [] &&
            state.posts.posts.map((p) => (
              <Post key={p.id} post={p} comp="home" />
            ))}
        </div>
      )}
    </>
  );
}
