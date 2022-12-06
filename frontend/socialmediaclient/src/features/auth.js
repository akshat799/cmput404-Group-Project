import * as api from "../api";
import { createSlice } from "@reduxjs/toolkit";
import { resetPosts } from "./posts";
import { resetUserPosts } from "./userposts";

const initialState = {
  isSignedIn: false,
  author: {},
  followers: [],
  error: false,
};

export const authorSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.isSignedIn = true;
      state.author = action.payload.data.user;
      state.error = false;
    },
    signOut: (state) => {
      state.isSignedIn = false;
      state.error = false;
      state.author = {};
    },
    editProfile: (state, action) => {
      state.author = action.payload.data.user;
    },
    updateFollowers: (state, action) => {
      state.followers = action.payload;
    },
    authError: (state) => {
      state.error = true;
    },
  },
});

export const signUp = (data) => async (dispatch) => {
  try {
    const responseData = await api.register(data);
    console.log(responseData);
    return responseData.status;
  } catch (e) {
    return e?.response?.data?.detail;
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const resp = await api.signIn(data);

    if (resp.status === 200) {
      dispatch(signIn(resp));
      localStorage.setItem("token", resp.data.access);
      return resp;
    } else {
      dispatch(authError);
      return resp;
    }
  } catch (e) {
    dispatch(authError);
    return e?.response?.data?.detail;
  }
};

export const getOwnFollowers = (author_id) => async (dispatch) => {
  try {
    const res = await api.getFollowerList(author_id);
    dispatch(updateFollowers(res.data.items));
  } catch (e) {
    console.log(e);
  }
};

export const logout = () => async (dispatch) => {
  dispatch(signOut());
  localStorage.removeItem("token");
};

export const { signIn, signOut, editProfile, updateFollowers, authError } =
  authorSlice.actions;

export default authorSlice.reducer;
