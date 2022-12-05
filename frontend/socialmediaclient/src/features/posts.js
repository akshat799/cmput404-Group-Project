import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  posts: [],
  postlikeCount: 0,
  error: false,
};

export const authorSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePostLikes: (state, action) => {
      state.postlikesCount = action.payload;
    },
    reset: (state) => {
      state.posts = [];
    },
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

export const addNewPost = (data, author_id) => async (dispatch) => {
  try {
    const res = await api.createNewPost(data, author_id);
    dispatch(addPost(res.data))
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const getPostLikes = (author_id, post_id) => async (dispatch) => {
  try {
    const resp = await api.getPostLikes(author_id, post_id);

    if (resp.status == 200) {
      // TODO: check resp object and fix
      dispatch(updatePostLikes(resp.data));
    }
  } catch (e) {
    console.log(e);
  }
};

export const resetPosts = () => (dispatch) => {
  dispatch(reset());
};

export const { updatePosts, addPost, updatePostLikes, reset } = authorSlice.actions;

export default authorSlice.reducer;
