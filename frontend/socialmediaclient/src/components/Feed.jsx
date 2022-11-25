import React from 'react'
import "./feed.css"
import PostOption from "./PostOption"
import Post from './Post'
import { Posts } from "../dummy";

export default function Feed() {
  return (
    <div className="feed">

    <PostOption/>
    {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
    </div>

  )
}
