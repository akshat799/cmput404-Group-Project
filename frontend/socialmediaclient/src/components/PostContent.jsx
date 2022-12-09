import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function PostContent(post) {
  const type = post.contentType.contentType.split("/");
  const content =
    post.comp == "post" ? post.contentType.content : post.contentType.comment;

  const [text, setText] = useState(true);
  const [otherType, setOtherType] = useState(null);
  const [textType, setTextType] = useState("plain");

  useEffect(() => {
    if (type[0] === "text") {
      setTextType(type[1]);
    } else if (type[0] === "image") {
      setText(false);
      setOtherType("image");
    } else if (type[0] === "application") {
      setText(false);
      setOtherType("application");
    } else {
      //error handling to be done over here
    }
  }, [post?.isChanged]);

  function isBase64(str) {
    if (str === "" || str.trim() === "") {
      return false;
    }
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }

  function createHTML() {
    return { __html: content };
  }
  // post.change(false)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "2rem",
        color: "white",
      }}
    >
      {text ? (
        textType === "plain" ? (
          <div style={{ color: "white" }}>{content}</div>
        ) : textType === "markdown" ? (
          <ReactMarkdown style={{ color: "white" }}>{content}</ReactMarkdown>
        ) : (
          <div
            dangerouslySetInnerHTML={createHTML()}
            style={{ color: "white" }}
          ></div>
        )
      ) : otherType === "application" ? (
        (console.log("HERE", content),
        (
          <div style={{ color: "white" }}>
            {isBase64(content) ? atob(content) : null}
          </div>
        ))
      ) : (
        <>
          <img
            src={content}
            style={{
              height: post.comp == "post" ? "60vh" : "30vh",
              width: "auto",
              maxWidth: post.comp == "post" ? "50vw" : "30vw",
              objectFit: "contain",
            }}
          />
        </>
      )}
    </div>
  );
}

export default PostContent;
