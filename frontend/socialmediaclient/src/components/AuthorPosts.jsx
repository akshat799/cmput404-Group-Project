import React from 'react'
import "./AuthorPosts.css"
import PostOption from "./PostOption"
import Post from './Post'
import { Posts } from "../dummy";

export default function AuthorPosts() {
  return (
    <div className="authorPosts">
    
    <PostOption/>
    {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
    </div>

  )
}








