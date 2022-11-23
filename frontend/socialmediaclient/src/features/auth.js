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

export const { signIn, signOut, editProfile } = authorSlice.actions

export default authorSlice.reducer
