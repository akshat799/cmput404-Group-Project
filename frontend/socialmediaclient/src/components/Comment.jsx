import { Avatar, Grid, Paper } from "@material-ui/core";
import React from 'react';
import './Comment.css';
const Comment = () => {
    const imgLink =
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";
    const [commentLike, setCommentLike] = React.useState(true);
    const handleLike = () => {
        setCommentLike((prevState) => !prevState);
    };
    return (
        <>
            <Paper style={{ padding: "10px 10px", marginTop: 60 }}>
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
                        <p className="commentLikeDiv">
                            <span className="commentLike" onClick={handleLike} >{commentLike ? <p>Like</p> : <p>Dislike</p>}</span>  <span>posted 1 minute ago</span>
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