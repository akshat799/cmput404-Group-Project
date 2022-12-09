import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  posts: [],
  error: false,
};

export const authorSlice = createSlice({
  name: "userposts",
  initialState,
  reducers: {
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    editPost: (state, action) => {
      state.posts[action.payload.index] = action.payload.data;
    },
    resetUserPost: (state) => {
      state.posts = [];
    },
  },
});

export const getAuthorPosts = (data) => async (dispatch) => {
  try {
    const res = await api.getAuthorPosts(data);

    if (res.status == 200) {
      dispatch(updatePosts(res.data));
      return res;
    }
  } catch (e) {
    console.log(e);
  }
};

export const makePost = (data, author_id) => async (dispatch) => {
  try {
    const res = await api.createNewPost(data, author_id);
    dispatch(addPost(res.data));
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const editPosts =
  (data, author_id, post_id, index) => async (dispatch) => {
    try {
      const res = await api.updatePost(data, author_id, post_id);
      const payload = { "data": res.data, "index": index };
      dispatch(editPost(payload));
      return res;
    } catch (e) {
      console.log(e);
    }
  };

export const resetUserPosts = () => (dispatch) => {
  dispatch(resetUserPost());
};

export const deletePostRequest = (author_id, post_id, arr) => async (dispatch) => {
  try{
    const res = await api.deletePost(author_id, post_id)
    console.log(res)
    if( res.status == 202){
      dispatch(updatePosts(arr))
      console.log(res)
      return res;
    }
  } catch (e) {
    console.log(e)
  }
}; 

export const { updatePosts, addPost, editPost, resetUserPost } =
  authorSlice.actions;

export default authorSlice.reducer;
