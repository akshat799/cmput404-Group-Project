import * as api from "../api";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifs: [],
  requests: [],
  liked: [],
  error: false,
};

export const authorSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    fetchNotifs: (state, action) => {
      state.notifs = action.payload;
    },
    fetchRequests: (state, action) => {
      state.requests = action.payload;
    },
    fetchLiked: (state, action) => {
      state.liked = action.payload;
    },
    updateRequests: (state, action) => {
      state.requests = state.requests.filter((req, i) => i != action.payload);
    },
  },
});

export const getNotifications = (author_id) => async (dispatch) => {
  const { data } = await api.getInbox(author_id);
  const notifs = data.items.filter(
    (notif) =>
      (notif?.type != "follow" && notif?.type != "Follow") || !("type" in notif)
  );

  const requests = data.items.filter(
    (notif) => notif.type == "follow" || notif.type == "Follow"
  );
  dispatch(fetchNotifs(notifs));
  dispatch(fetchRequests(requests));
};

export const addFollower =
  (author_id, foreign_author_id, index) => async (dispatch) => {
    try {
      const res = await api.addFollower(author_id, foreign_author_id);
      return res;
    } catch (e) {
      console.log(e);
    }
  };

export const denyRequest = (index) => async (dispatch) => {
  dispatch(updateRequests(index));
};

export const followUser =
  (foreign_author_id, index, data) => async (dispatch) => {
    try {
      const res = await api.sendRequest(foreign_author_id, data);
      dispatch(updateRequests(index));
    } catch (e) {
      console.log(e);
    }
  };

export const getLiked = (author_id) => async (dispatch) => {
  try {
    const res = await api.getLiked(author_id);
    dispatch(fetchLiked(res.data.items));
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const sendPost = (author_id, data) => async (dispatch) => {
  try {
    const res = await api.sendPost(author_id, data);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const { fetchNotifs, fetchRequests, updateRequests, fetchLiked } =
  authorSlice.actions;

export default authorSlice.reducer;
