import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function PostContent(post) {
  const type = post.contentType.contentType.split("/");
  const content = post.contentType.content;

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
  }, []);

  function decode_utf8(s) {
    return decodeURIComponent(s);
  }

  function createHTML() {
    return { __html: content };
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text ? (
        textType === "plain" ? (
          <div>{decode_utf8(content)}</div>
        ) : textType === "markdown" ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          // <div dangerouslySetInnerHTML={createHTML()}></div>
          <div>{content.replace(/(<([^>]+)>)/gi, "")} </div>
        )
      ) : otherType === "application" ? (
        <div>{atob(content)}</div>
      ) : (
        <>
          <img src={content} style={{ height: "60vh", width: "auto" }} />
        </>
      )}
    </div>
  );
}

export default PostContent;
