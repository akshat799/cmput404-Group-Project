import * as api from "../api"
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSignedIn: false,
  author: {},
  error: false,
}

export const authorSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      signIn: (state, action) => {
        state.isSignedIn = true
        state.author = action.payload
        state.error = false
      },
      signOut: (state) => {
        state.isSignedIn = false
        state.error = false
        state.author= {}
      },
      editProfile: (state,action) => {
        state.author = action.payload
      },
      authError: (state) => {
        state.error = true
      }
    },
  })

export const signUp = (data) => async(dispatch) => {
  const responseData = await api.register(data);
  return responseData.status;
}


export const login = (data) => async(dispatch) => {

  try{
      const resp = await api.signIn(data);
    
      if(resp.status === 200){
        dispatch(signIn);
        dispatch(editProfile(resp.data))
        return resp.status
      }
  }
  catch(e){
      dispatch(authError);
      return "error"
  }
}

export const logout = () => (dispatch) =>{
  dispatch(signOut);
}  

export const { signIn, signOut, editProfile, authError } = authorSlice.actions

export default authorSlice.reducer
