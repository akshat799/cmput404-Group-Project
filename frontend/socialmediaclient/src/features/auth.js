import * as api from "../api"
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSignedIn: false,
  author: { 
    displayName : "Admin", 
    profileImage: process.env.PUBLIC_URL + "/images/ProfileIcon.png",
  },
  error: false,
  allLiked: [],
  allAuthors: [],
  followers: [],
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
      },
      updateAllAuthorsList: (state, action) => {
        state.allAuthors = action.payload;
      },
      updateFollowers: (state, action) => {
        state.followers = action.payload;
      }, 
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

export const getAllAuthorsList = () => async(dispatch) => {
  try{
    const resp = await api.getAuthorList()
    console.log(resp)
    if (resp.status == 200) {
      dispatch(updateAllAuthorsList(resp.data.items))
    }
  } catch(e){
    console.log(e)
  }

}
export const getOwnFollowers = (author_id) => async(dispatch) => {
  try{
    const res= await api.getFollowerList(author_id);
    // console.log(responseData);
    if (res.status == 200){
        console.log(res.data.items)
        dispatch(updateFollowers(res.data.items))
    }
    // return responseData.status;
  }
  catch(e){
    console.log(e) 
}
}

export const checkIfFollower = (author_id, foreign_author_id) => async(dispatch) => {
    try{
      const res = await api.checkFollower(author_id, foreign_author_id);
      console.log(res);
    //   dispatch(updateFollowers)
      return res;
    }
    catch(e){
      console.log(e)
  }
}

  export const acceptFollowRequest = (author_id, foreign_author_id) => async(dispatch) => {
    try{
      const responseData = await api.addFollower(author_id, foreign_author_id);
      console.log(responseData);
    //   dispatch(updateFollowers)
      return responseData.data;
    }
    catch(e){
      console.log(e)
  }
}

  export const removeFromfollowers = (author_id, foreign_author_id) => async() => {
    try{
      const res = await api.removeFollower(author_id, foreign_author_id);
      console.log(res);
    //   dispatch(updateFollowers)
      return res;
    }
    catch(e){
      console.log(e)
  }
}
export const sendRequestToFollow = (foreign_author_id, data) => async() => {
  try{
    const res = await api.sendRequest(foreign_author_id, data);
    console.log(res);
    return res;
  }
  catch(e){
    console.log(e)
}
}

export const { signIn, signOut, editProfile, authError, updateAllLiked, updateAllAuthorsList, updateFollowers } = authorSlice.actions

export default authorSlice.reducer