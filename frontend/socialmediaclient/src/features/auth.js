import * as api from "../api"
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSignedIn: false,
  author: { 
    displayName : "Admin", 
    profileImage: process.env.PUBLIC_URL + "/images/ProfileIcon.png",
  },
  error: false,
  allLiked: []
}

export const authorSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      signIn: (state, action) => {
        state.isSignedIn = true
        state.author = action.payload.data.user
        state.error = false
      },
      signOut: (state) => {
        state.isSignedIn = false
        state.error = false
        state.author= {}
      },
      editProfile: (state,action) => {
        state.author = action.payload.data.user
      },
      authError: (state) => {
        state.error = true
      },
      updateAllLiked: (state, action)  => {
        state.allLiked = action.payload;
      }
    },
  })

export const signUp = (data) => async(dispatch) => {
  try{
    const responseData = await api.register(data);
    // console.log(responseData);
    return responseData.status;
  }
  catch(e){
    return(e?.response?.data?.detail);
  }
}

export const login = (data) => async(dispatch) => {

  try{
      const resp = await api.signIn(data);

      if(resp.status === 200){
        dispatch(signIn(resp));
        localStorage.setItem("token", resp.data.access);
        // console.log(resp)
        return resp
      }
      else{
        dispatch(authError)
        return resp
      }
  }
  catch(e){
      dispatch(authError);
      return(e?.response?.data?.detail);
  }
}

export const logout = () => async(dispatch) =>{
  dispatch(signOut());
  localStorage.removeItem('token')
}

export const getAllLiked = (author_id) => async(dispatch) => {
  try{
    const resp = await api.getLiked(author_id)

    if (resp.status == 200) {
      dispatch(updateAllLiked(resp.data.items))
    }
  } catch(e) {
    console.log(e)
  }
}

export const { signIn, signOut, editProfile, authError, updateAllLiked } = authorSlice.actions

export default authorSlice.reducer