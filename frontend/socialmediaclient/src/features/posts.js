import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  posts: [],
  postlikeCount: 0,
  error: false,
  allLiked: []
};

export const authorSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
    updatePostLikes: (state, action) => {
      state.postlikesCount = action.payload;
    }
  },
});

export const getPublicPosts = () => async (dispatch) => {
  try {
    const res = await api.getPublicPosts();

    if (res.status == 200) {
      console.log(res)
      dispatch(updatePosts(res.data.items));
      return res;
    }
  } catch (e) {
    console.log(e);
  }
};

export const getPostLikes = (author_id, post_id) => async (dispatch) => {
  try{
    const resp = await api.getPostLikes(author_id, post_id);
    console.log(resp)

    if (resp.status == 200) {
      // TODO: check resp object and fix
      dispatch(updatePostLikes(resp.data.length))
      return resp.data.length
    }
  } catch (e) {
    console.log(e);
  }
};

export const sendLiketoAuthor = (authorId, data) => async() => {
  try{
    const resp = await api.sendLike(data, authorId);
    // console.log(authorId)
    // console.log(data)

    if (resp.status == 201){
      console.log(resp)
      return resp.status
    }
  } catch (e) {
    console.log(e)
  }
};

export const addComment = (author_id, post_id, data) => async() =>{
  try{
    const resp = await api.postComment(author_id, post_id, data)
    console.log(resp)

    if (resp.status == 201){
      return resp.status
    }
  } catch (e) {
    console.log(e)
  }
};
export const getCommentsOnPost = (author_id, post_id) => async(dispatch) => {
  try{
    const resp = await api.getComments(author_id, post_id)
    console.log(resp)

    if (resp.status == 200) {
      return resp.data.comments
    }
  } catch(e) {
    console.log(e)
    return []
  }
}

export const { updatePosts, updatePostLikes} = authorSlice.actions;

export default authorSlice.reducer;
