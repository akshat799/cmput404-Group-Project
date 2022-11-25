import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  signUpSuccess: false,
  error: None
}

export const authorSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
      signUp: (state) => {
        state.signUpSuccess = true
      },
      passwordError: (state) => {
        state.signUpSuccess = false
        
      } 
    },
  })

export const { signIn, signOut, editProfile } = authorSlice.actions

export default authorSlice.reducer
