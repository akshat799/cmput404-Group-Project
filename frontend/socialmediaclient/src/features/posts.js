import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  posts: [],
  error: false,
};

export const authorSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
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

export const { updatePosts } = authorSlice.actions;

export default authorSlice.reducer;
