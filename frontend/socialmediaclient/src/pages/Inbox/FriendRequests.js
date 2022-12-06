import React from "react";
import { useSelector } from "react-redux";
import FollowerButtons from "../../components/followerButtons";
import "./Inbox.css";

function FriendRequests() {
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
            Friend Requests : {state.notifications.requests.length}
          </h1>
        </div>
      </header>
      {state.notifications.requests != [] &&
        state.notifications.requests.map((req, i) => {
          return (
            <div class="notiContainer">
              <main>
                <div class="container">
                  <img
                    src={req.actor.profileImage}
                    alt="avatar"
                    className="img"
                  />
                  <div class="description">
                    <p class="user_activity">
                      {req.actor.displayName} wants to follow you
                    </p>
                  </div>
                  <FollowerButtons req={req} i={i} />
                </div>
              </main>
            </div>
          );
        })}
    </div>
  );
}

export default FriendRequests;
