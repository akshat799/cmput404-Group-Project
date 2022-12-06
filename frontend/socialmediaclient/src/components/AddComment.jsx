import React from 'react';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { addComment } from '../features/posts';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useState } from 'react';


const AddComment = ({currentAuthorId, postId}) => {

    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const imgLink = state.auth.profileImage;
    

    const [commentText, setCommentText] = useState("")
    
    const sendComment = async () => {
        let data = {
            "comment": commentText,
            "contentType": "text/plain",
        };
        console.log(currentAuthorId, postId) 
        const status = await dispatch(addComment(currentAuthorId, postId, data))
        
        if( status == 200){
            setCommentText("")
        }}
    return (
    <>
        <div style={{ marginTop: 15 }} className="postTop">
            <div className="postTopLeft">
                <img
                    className="commentProfileImg "
                    src={imgLink}
                    alt=""
                    style={{ marginLeft: 10 }}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Enter your comment"
                    multiline
                    rows={2}
                    placeholder="write something..."
                    style={{ width: 400, marginLeft: 20 }}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <Button variant="contained" style={{ marginLeft: 10 }} onClick={sendComment}>Add comment</Button>
            </div>
        </div>
    </>
    );
};

export default AddComment;