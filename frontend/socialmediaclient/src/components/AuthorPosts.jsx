import React from 'react'
import "./AuthorPosts.css"
import PostOption from "./PostOption"
import Post from './Post'
import { getAuthorPosts } from '../api'
import { Posts } from "../dummy";
import { useStore } from 'react-redux'

export default function AuthorPosts() {

  const store = useStore()
  const state = store.getState()

  const authorId = state.auth.author.id

  const getPosts = async() => {
    const response = await getAuthorPosts(authorId) 
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








