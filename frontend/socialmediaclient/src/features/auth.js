import * as api from "../api"
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSignedIn: false,
  author: {}
}

export const authorSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      signIn: (state) => {
        state.isSignedIn = true
      },
      signOut: (state) => {
        state.isSignedIn = false
      },
      editProfile: (state,action) => {
        state.author = action.payload
      }
    },
  })

export const signUp = (data) => async(dispatch) => {
  const responseData = await api.register(data);
  return responseData.status;
}

export const login = (data) => async(dispatch) => {
  const response = await api.signIn(data);
  if(response.status == 200){
    dispatch(signIn);
    dispatch(editProfile(response.data));
  }
}

export const { signIn, signOut, editProfile } = authorSlice.actions

export default authorSlice.reducer
