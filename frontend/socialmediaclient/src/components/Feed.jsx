import React, {useEffect, useState} from 'react'
import "./feed.css"
import PostOption from "./PostOption"
import Post from './Post'
import { Posts } from "../dummy";
import { useStore } from "react-redux";
import { getAuthorPosts } from '../api';

export default function Feed() {

  const store = useStore()
  const state = store.getState()

  const authorId = state.auth.author.id;
  const [posts, setPosts] = useState([]);

  // const authorId = state.auth.author.id.split("/")[-1]
  const getPosts = async() => {
    const response = await getAuthorPosts(authorId);
    setPosts(response.data)
  }

  useEffect(() => {
    getPosts();
  }, [])

  return (
    <div className="feed">

    <PostOption/>
    {posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
    </div>

  )
}
