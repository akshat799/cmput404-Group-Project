import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LikesTile from "../../components/LikesTile";
import Post from "../../components/Post";
import "./Inbox.css";
const Inbox = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#DADADA";
  }, []);

  const state = useSelector((state) => state);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <header>
        <div class="notif_box">
          <h1 class="title">
            Notifications : {state.notifications.notifs.length}
          </h1>
        </div>
      </header>
      {state.notifications.notifs != [] &&
        state.notifications.notifs.map((notif) => {
          if (
            notif.type == "like" ||
            notif.type == "Like" ||
            notif.type == "comment" ||
            notif.type == "Comment"
          ) {
            return <LikesTile notif={notif} />;
          } else {
            return <Post post={notif} comp="inbox" />;
          }
        })}
    </div>
  );
};

export default Inbox;
