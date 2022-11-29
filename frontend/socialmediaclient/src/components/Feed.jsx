import React, {useEffect, useState} from 'react'
import "./feed.css"
import PostOption from "./PostOption"
import Post from './Post'
import { useSelector } from "react-redux";
import { getPublicPosts } from "../features/posts";
import { useDispatch } from 'react-redux';

export default function Feed() {

  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const authorId = state.auth.author.id;

  // const authorId = state.auth.author.id.split("/")[-1]
  const getPosts = async() => {
    await dispatch(getPublicPosts());
  }

  useEffect(() => {
    getPosts();
  }, [])

  return (
    <div className="feed">

    <PostOption/>
    {state.posts.posts != [] && state.posts.posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
    </div>

  )
}
