import React from "react";
import { useSelector } from "react-redux";

function CommentTile({ notif }) {
  const state = useSelector((state) => state);

  const postAuthor = state.auth.allAuthors.filter(
    (author) =>
      author.id.split("/").reverse()[0] === notif.post.split("/").reverse()[2]
  );

  const post = state.userposts.posts.filter(
    (post) =>
      post.id.split("/").reverse()[0] === notif.post.split("/").reverse()[0]
  );

  return (
    <div class="notiContainer">
      <main>
        <div class="notif_card read">
          <img src={notif.author.profileImage} alt="avatar" className="img" />
          <div class="description">
            <p class="user_activity">
              {notif.author.displayName} added a comment on{" "}
              {postAuthor[0].displayName}'s post {post[0]?.title}: {notif.comment}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CommentTile;
