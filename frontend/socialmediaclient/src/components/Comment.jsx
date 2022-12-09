import { Avatar, Grid, Paper, responsiveFontSizes } from "@material-ui/core";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import React from 'react';
import './Comment.css';
import { useDispatch } from "react-redux";
import { sendLiketoAuthor } from "../features/posts";
import { getLikesOnComment } from '../features/posts';
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const Comment = ({data, comment, postAuthorId}) => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch()
    const imgLink = comment.author.profileImage
    const commentText = comment.comment
    const commentAuthor = comment.author.displayName
    const commentAuthorId = comment.author.id.split("/").reverse()[0]
    const commentId = comment.id.split("/").reverse()[0]

    const postId = data["post"];
    const currentAuthorId = state.auth.author.id;

    const [commentLikesList, setCommentLikesList] = useState([])
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const getCommentLikes = async () => {
        const resp = await dispatch(getLikesOnComment(postAuthorId, postId, commentId));
        // await console.log(resp)
        await setLikeCount(resp.length)
        await setCommentLikesList(resp)
        // getIsLiked()
    };
    const getIsLiked = () => {
        for (let c of commentLikesList){
            console.log('setting....')
            console.log(c.author.id, currentAuthorId)
            if( c.author.id === currentAuthorId){
                console.log('set')
                setIsLiked(true)
                break;
          }
        }
      }
    const handleLike = async() => {
        if (isLiked === false) {
            data["comment"] = commentId
            data["summary"] = state.auth.author.displayName + " likes your comment";
            data["author"] = currentAuthorId
            console.log()
            const resp = await dispatch(sendLiketoAuthor(currentAuthorId, data))
            await console.log(resp)
            if (resp == 201){
                console.log(resp)
                setIsLiked(true)
                getCommentLikes()
            }
        }
    };

    useEffect(() => {
        getCommentLikes();
        getIsLiked();
    }, []);

    return (
        <>
            <Paper style={{ padding: "10px 10px", marginTop: 20 }}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar alt="Remy Sharp" src={imgLink} />
                    </Grid>
                    <Grid  item xs zeroMinWidth>
                        <h4 style={{ margin: 0, textAlign: "left" }}>{commentAuthor}</h4>
                        <p style={{ textAlign: "left" }}>
                            {commentText}
                        </p>
                        
                        <p style={{ textAlign: "left", margin: 0 }}>
                            <div style={{
                                display: 'flex',
                                gap: '5px',
                                justifyContent: 'end'
                         
                            }}>
                            
                                <ThumbUpAltIcon style={{ color: isLiked? "blue":"gray"  }} onClick={handleLike} />
                                <span style={{ color: "gray"}}> {likeCount}</span>
                            </div>

                        </p>
                        
                        {/* <p className="commentLikeDiv">
                            <span className="commentLike" onClick={handleLike} >{commentLike ? <p>Like</p> : <p>   Dislike</p>}</span>
                        </p> */}
                    </Grid>
                </Grid>
            </Paper> 
        </>
    );
};

export default Comment;