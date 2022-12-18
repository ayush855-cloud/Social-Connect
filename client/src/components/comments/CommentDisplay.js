import React, { useState,useEffect } from 'react'
import CommentCard from './CommentCard'

function CommentDisplay({comment,post,replyComments}) {
    const [showReply,setShowRep]=useState([]);
    const [next,setNext]=useState(1);
    useEffect(() => {
       setShowRep(replyComments.slice(replyComments.length-next));
    }, [replyComments,next])
    return (
        <div className="comment_display">
            <CommentCard comment={comment} post={post} commentId={comment._id}>
            <div className="pl-4">
                {
                    showReply.map((item,index)=>(
                        
                        <CommentCard key={index}
                            comment={item}
                            post={post}
                            commentId={comment._id}
                        />
                    ))
                }
                {
            replyComments.length-next>0 ?
            <div style={{cursor:'pointer',color:'rgb(17, 87, 114)',fontWeight:"700"}} onClick={()=>setNext(next+10)}>
             See More Comments...
            </div>

            :replyComments.length>1 && <div style={{cursor:'pointer',color:'rgb(17, 87, 114)',fontWeight:"700"}} onClick={()=>setNext(1)}>
              Hide Comments...
            </div>
        }
            </div>
            </CommentCard>  
        </div>
    )
}

export default CommentDisplay
