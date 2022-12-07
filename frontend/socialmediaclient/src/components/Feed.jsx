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

  return (
    <>
      {state.posts.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="feed">
          <PostOption />
          {state.posts.posts != [] &&
            state.posts.posts.map((p, i) => (
              <Post key={p.id} post={p} comp="home" index={i} />
            ))}
        </div>
      )}
    </>
  );
}
