import { Avatar, Grid, Paper } from "@material-ui/core";
import React from 'react';

const Comment = (comment) => {

    const imgLink = comment.author.profileImage
    const commentText = comment.comment
    const commentAuthor = comment.author.displayName
    return (
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
            </Grid>
        </Grid>
    </Paper>
   
    );
};

export default Comment;