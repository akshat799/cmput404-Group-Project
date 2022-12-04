import { Avatar, Grid, Paper } from "@material-ui/core";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import React from 'react';

const Comment = (comment) => {

    const imgLink = comment.author.profileImage
    const commentText = comment.comment
    const commentAuthor = comment.author.displayName
    return (
        <>
            <Paper style={{ padding: "10px 10px", marginTop: 60 }}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar alt="Remy Sharp" src={imgLink} />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                        <h4 style={{ margin: 0, textAlign: "left" }}>{commentAuthor}</h4>
                        <p style={{ textAlign: "left" }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                            luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet.
                            {commentText}
                        </p>

                        <p style={{ textAlign: "left", marginTop: 10 }}>
                            <div style={{
                                display: 'flex',
                                gap: '5px'
                            }}>
                                <ThumbUpAltIcon color="primary" />
                                <span>Michel and 26 others </span>
                            </div>

                        </p>
                        <hr />
                        <p className="commentLikeDiv">
                            <span className="commentLike" onClick={handleLike} >{commentLike ? <p>Like</p> : <p>   Dislike</p>}</span>  <span>posted 1 minute ago</span>
                        </p>
                    </Grid>
                </Grid>
            </Paper>
            <Paper style={{ padding: "10px 10px", marginTop: 20 }}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar alt="Remy Sharp" src={imgLink} />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                        <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
                        <p style={{ textAlign: "left" }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                            luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet.

                        </p>
                        <p style={{ textAlign: "left", marginTop: 10 }}>
                            <div style={{
                                display: 'flex',
                                gap: '5px'
                            }}>
                                <ThumbUpAltIcon color="primary" />
                                <span>Michel and 26 others </span>
                            </div>

                        </p>
                        <hr />
                        <p className="commentLikeDiv">
                            <span className="commentLike" onClick={handleLike} >{commentLike ? <p>Like</p> : <p>Dislike</p>}</span>  <span>posted 1 minute ago</span>
                        </p>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};

export default Comment;