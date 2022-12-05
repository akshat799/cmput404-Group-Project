import React from 'react';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { addComment } from '../features/posts';
import { useDispatch } from 'react-redux';
const AddComment = ({authorId, postId}) => {

    const dispatch = useDispatch();
    const imgLink =
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

        const sendComment = async () => {
            await dispatch(addComment(authorId, postId))
          }
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

                    />
                    <Button variant="contained" style={{ marginLeft: 10 }} onClick={sendComment}>Add comment</Button>
                </div>
            </div>
        </>
    );
};

export default AddComment;