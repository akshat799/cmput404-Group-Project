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

export const { updatePosts } = authorSlice.actions;

export default authorSlice.reducer;
