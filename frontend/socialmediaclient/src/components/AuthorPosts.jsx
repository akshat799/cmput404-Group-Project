import React, { useEffect, useState } from 'react'
import "./AuthorPosts.css"
import PostOption from "./PostOption"
import Post from './Post'
import { getAuthorPosts } from '../api'
import { Posts } from "../dummy";

export default function AuthorPosts({state}) {
  const authorId = state.auth.author.id;
  const [posts, setPosts] = useState([]);

  console.log(authorId)
  // const authorId = state.auth.author.id.split("/")[-1]
  const getPosts = async() => {
    const response = await getAuthorPosts(authorId);
    setPosts(response.data)
  }

  useEffect(() => {
    getPosts();
  }, [])

  return (
    <div className="authorPosts">
    
    <PostOption/>
    {posts.map((p) => (<Post key={p.id} post={p} />
        ))}
    </div>

  )
}








