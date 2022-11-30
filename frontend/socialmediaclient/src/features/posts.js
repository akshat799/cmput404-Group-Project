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

    if (resp.status == 200) {
      // TODO: check resp object and fix
      dispatch(updatePostLikes(resp.data))
    }
  } catch (e) {
    console.log(e);
  }
}

export const { updatePosts, updatePostLikes } = authorSlice.actions;

export default authorSlice.reducer;
