import axios from 'axios';

const api = axios.create({baseURL : 'https://cmput404team18-backend.herokuapp.com/'});

api.interceptors.request.use((req) =>{
    if(localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
})

//AUTH
export const signIn = (data) => api.post('backendapi/auth/login/', data);
export const register = (data) => api.post('backendapi/auth/register/', data);

//AUTHORS
export const getAuthorList = () => api.get('backendapi/authors/');
export const getAuthor = (author_id) => api.get(`backendapi/authors/${author_id}/`);
export const updateAuthor = (data, author_id) => api.post(`backendapi/authors/${author_id}/`, data);

//FOLLOWERS
export const getFollowerList = (author_id) => api.get(`backendapi/authors/${author_id}/followers/`) 
export const checkFollower = (author_id, foreign_author_id) => api.get(`backendapi/authors/${author_id}/followers/${foreign_author_id}/`) 
export const addFollower = (author_id, foreign_author_id) => api.put(`backendapi/authors/${author_id}/followers/${foreign_author_id}/`)
export const removeFollower = (author_id, foreign_author_id) => api.delete(`backendapi/authors/${author_id}/followers/${foreign_author_id}/`)

// POST
export const getPublicPost = (author_id, post_id) => api.get(`backendapi/authors/${author_id}/posts/${post_id}/`);
export const getPublicPosts = () => api.get('backendapi/authors/posts/')
export const createPost = (data, author_id, post_id) => api.put(`backendapi/authors/${author_id}/posts/${post_id}/`, data);
export const updatePost = (data, author_id, post_id) => api.post(`backendapi/authors/${author_id}/posts/${post_id}/`, data);
export const deletePost = (author_id, post_id) => api.delete(`backendapi/authors/${author_id}/posts/${post_id}/`);


export const getAuthorPosts = (author_id) => api.get(`backendapi/authors/${author_id}/posts/`);
export const createNewPost = (data, author_id) => api.post(`backendapi/authors/${author_id}/posts/`, data);

//POST IMAGE
export const createPostWithImage = (author_id, post_id) => api.get(`backendapi/authors/${author_id}/posts/${post_id}/image/`);

//COMMENTS
export const getComments = (author_id, post_id) => api.get(`backendapi/authors/${author_id}/posts/${post_id}/comments/`);
export const postComment = (author_id, post_id) => api.post(`backendapi/authors/${author_id}/posts/${post_id}/comments/`);

//LIKES
export const sendLike = (data, author_id) => api.post(`backendapi/authors/${author_id}/inbox/`, data);
export const getPostLikes = (author_id, post_id) => api.get(`backendapi/authors/${author_id}/posts/${post_id}/likes/`);
export const getCommentLikes = (author_id, post_id, comment_id) => api.get(`backendapi/authors/${author_id}/posts/${post_id}/comments/${comment_id}/likes/`)

//LIKED
export const getLiked = (author_id) => api.get(`backendapi/authors/${author_id}/liked/`);

//INBOX
export const getInboxPosts = (author_id) => api.get(`backendapi/authors/${author_id}/inbox/`);
export const sendPost = (author_id) => api.post(`backendapi/authors/${author_id}/inbox/`);
export const clearInbox = (author_id) => api.delete(`backendapi/authors/${author_id}/inbox/`);