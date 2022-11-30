import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth';
import postsReducer from './features/posts';
import userpostsReducer from './features/userposts';


const store = configureStore({
    reducer: {
        auth: authReducer,
        posts : postsReducer,
        userposts : userpostsReducer, 
    }
});
  
export default store