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
    },
    setError: (state) => {

    }
  },
});

export const getPublicPosts = () => async (dispatch) => {
  try {
    const res = await api.getPublicPosts();

    if (res.status == 200) {
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

    if (resp.status == 200) {
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

    if (resp.status == 201){
      return resp.status
    }
  } catch (e) {
    console.log(e)
  }
};

export const addComment = (author_id, post_id, data) => async(dispatch) =>{
  try{
    const resp = await api.postComment(author_id, post_id, data)
    console.log(resp)

    if (resp.status == 201){
      dispatch(setError)
      return resp.status
    }
  } catch (e) {
    console.log(e)
    return 400
  }
};
export const getCommentsOnPost = (author_id, post_id) => async(dispatch) => {
  try{
    const resp = await api.getComments(author_id, post_id)

    if (resp.status == 200) {
      return resp.data.comments
    }
  } catch(e) {
    console.log(e)
    return []
  }
}

export const { updatePosts, updatePostLikes, setError} = authorSlice.actions;

export default authorSlice.reducer;
