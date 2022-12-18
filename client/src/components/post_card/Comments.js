import React, { useState, useEffect } from "react";
import CommentDisplay from "../comments/CommentDisplay";

function Comments({ post }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const newCmm = post.comments.filter((cm) => !cm.reply);
    setComments(newCmm);
    setShowComments(newCmm.slice(newCmm.length - next));
  }, [post.comments, next]);

  useEffect(() => {

    const newReply = post.comments.filter((cm) => cm.reply);
    setReplyComments(newReply);
  }, [post.comments]);

  
  return (
    <div className="comments">
      {showComments.map((comment, index) => (
        <CommentDisplay
          key={index}
          comment={comment}
          post={post}

        //   replyComments which have those comments where the parent comment has reply's
          replyComments={replyComments.filter(
            (item) => item.reply === comment._id
          )}
          
        />
      ))}
      {comments.length - next > 0 ? (
        <div
          className="p-2 border-top"
          style={{
            cursor: "pointer",
            color: "rgb(17, 87, 114)",
            fontWeight: "700",
          }}
          onClick={() => setNext(next + 10)}
        >
          See More Comments...
        </div>
      ) : (
        comments.length > 2 && (
          <div
            className="p-2 border-top"
            style={{
              cursor: "pointer",
              color: "rgb(17, 87, 114)",
              fontWeight: "700",
            }}
            onClick={() => setNext(2)}
          >
            Hide Comments...
          </div>
        )
      )}
    </div>
  );
}

export default Comments;
