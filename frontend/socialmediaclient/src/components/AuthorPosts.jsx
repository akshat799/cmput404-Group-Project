import React from 'react'
import "./AuthorPosts.css"
import PostOption from "./PostOption"
import Post from './Post'
import { getAuthorPosts } from '../api'
import { Posts } from "../dummy";

export default function AuthorPosts() {

  const getPosts = async() => {
    const response = await getAuthorPosts(this.state.auth.author) 
    return response.json
  }

  return (
    <div className="authorPosts">
    
    <PostOption/>
    {Posts.map((p) => (<Post key={p.id} post={p} />
        ))}
    </div>

  )
}








