import { Modal, Typography, Box, Card } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendPost } from "../features/notifications";
import "./followerModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "50vh",
};

function FollowerModal({ open, handleCloseFollowerModal, id }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <Modal
      open={open}
      onClose={handleCloseFollowerModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={style} textAlign="center">
          <Box style={{ maxHeight: "40vh", height: "100%", overflow: "auto" }}>
            {state.auth.followers != [] &&
              state.auth.followers.map((follower) => {
                return (
                  <div>
                    <Card
                      className="card"
                      style={{ backgroundColor: "rgba(236, 236, 236)" }}
                      onClick={() => {
                        dispatch(
                          sendPost(state.auth.author.id, {
                            post: id,
                            type: "post",
                            author: follower.id,
                          })
                        );
                        handleCloseFollowerModal();
                      }}
                    >
                      {follower.displayName}
                    </Card>
                  </div>
                );
              })}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default FollowerModal;
