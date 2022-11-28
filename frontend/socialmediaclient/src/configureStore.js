import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth';
import postsReducer from './features/posts'


const store = configureStore({
    reducer: {
        auth: authReducer,
        posts : postsReducer,
    }
});
  
export default store