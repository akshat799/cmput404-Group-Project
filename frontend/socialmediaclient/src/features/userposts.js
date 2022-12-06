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
      state.posts[action.index] = action.payload;
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
      const data = { data: res.data, index: index };
      dispatch(editPost(data));
    } catch (e) {
      console.log(e);
    }
  };

export const resetUserPosts = () => (dispatch) => {
  dispatch(resetUserPost());
};

export const { updatePosts, addPost, editPost, resetUserPost } =
  authorSlice.actions;

export default authorSlice.reducer;
