import React,{useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../redux/actions/commentActions';
import '../../styles/comment.css';
import Icons from '../Icons';

function InputComment({children,post,reply,setOnReply,theme}) {
    const [content,setContent]=useState("");
    const {auth,socket}=useSelector(state=>state);
    const dispatch=useDispatch();

    const handleSubmit=(e)=>{
        e.preventDefault();
        const newComment={
            content:content,
            likes:[],
            user:auth.user,
            createdAt:new Date().toISOString(),
            reply: reply && reply.commentId,
            tag:reply && reply.user
        }
        
        dispatch(createComment({post,newComment,auth,socket}));
        setContent('');
        if(setOnReply) return setOnReply(false);
    }


    return (
        <form className="card-footer comment_input" onSubmit={handleSubmit}>
          {children}
          <input type="text" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Add your comments..."
              style={{filter: theme? 'invert(1)': 'invert(0)',
            color:theme? 'white' :'#111',
            background: theme ? 'rgba(0,0,0,.03)' : '',
            }}
          />

          <Icons setContent={setContent} content={content} theme={theme}/>

          <button type="submit" className="postBtn" style={{filter:theme?'invert(1)':'invert(0)',background:'none'}}>
           Post
          </button>
        </form>
    )
}

export default InputComment
