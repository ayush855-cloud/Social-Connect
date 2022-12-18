import { Avatar } from '@material-ui/core'
import React, { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import LikeButton from '../LikeButton';
import {useSelector,useDispatch} from 'react-redux';
import CommentMenu from './CommentMenu';
import { likeComment, unlikeComment, updateComment } from '../../redux/actions/commentActions';
import InputComment from '../post_card/InputComment';





function CommentCard({children,comment,post,commentId}) {
    const {auth,theme}=useSelector(state=>state);
    const dispatch=useDispatch();
    const [content,setContent]=useState('');
    const [readMore,setReadMore]=useState(false);
    const [isLike,setIsLike]=useState(false);
    const [onEdit,setOnEdit]=useState(false);
    const [loadLike,setLoadLike]=useState(false);
    const [reply,setOnReply]=useState(false);
    useEffect(() => {
        
        setContent(comment.content);
        setIsLike(false);
        // setOnReply(false);
        if(comment.likes.find(like=>like._id===auth.user._id)){
            setIsLike(true)
        }
       
    }, [comment,auth.user._id]) 

    const handleLike=async()=>{
        if(loadLike) return;
        setIsLike(true);
        setLoadLike(true);
        await dispatch(likeComment({comment,post,auth}));
        setLoadLike(false);
    }
    const handleUnlike=async()=>{
        if(loadLike) return;
        setIsLike(false);
        setLoadLike(true);
        await dispatch(unlikeComment({comment,post,auth}));
        setLoadLike(false);
    }

   
    const handleUpdate=()=>{
        if(comment.content!==content){
           dispatch(updateComment({comment,post,content,auth}))
           setOnEdit(false);
        }
        else{
            setOnEdit(false);
        }
    }
    const handleReply=()=>{
        if(reply) return setOnReply(false);
        setOnReply({...comment,commentId});
        console.log(reply);
    }
    return (
        <div className={`comment_card mt-2 ${onEdit && "setWidth"}`}>
        <Link to={`/profile/${comment.user._id}`} className="d-flex align-items-center text-dark">
            <Avatar src={comment.user.avatar} style={{filter:theme?'invert(1)':"invert(0)"}}/>
            <h6 className="mx-1 text-dark">{comment.user.username}</h6>

        </Link>   
        <div className="comment_content" style={{maxWidth:'280px'}}>
         <div className="comment_content_content" style={{filter: theme? 'invert(1)': 'invert(0)',
            color:theme? 'white' :'#111',
            textAlign:'justify'
            }}>
         {
             onEdit ? <textarea rows="5" value={content} onChange={e=>setContent(e.target.value)}/>:
             <div>
             {
                 comment.tag && comment.tag._id===comment.user._id &&
                 <Link to={`/profile/${comment.tag._id}`} style={{cursor:'pointer',color:'rgb(17, 87, 114)',fontWeight:"700"}}>
                     @{comment.tag.username+" "}
                 </Link>
             }
         <span className="text-dark" style={{fontWeight:'600'}}>
                {
                    content.length<100 ? content:
                    readMore ? content+'':content.slice(0,100)+'...'
                }
            </span>
            {
                content.length>100 && <span className="readMore"
                onClick={()=>setReadMore(!readMore)}>
                    {readMore?"Hide content" : "Read More"}
                </span>
            }
           
         </div>
         }
         <div style={{cursor:'pointer'}}>
               <span className="text-muted mr-3">{moment(comment.createdAt).fromNow()}</span>
               <span className="font-weight-bold mr-3">{comment.likes.length} likes</span>
               {
                   onEdit ? <>
                   <span className="font-weight-bold mr-3" onClick={handleUpdate}>Update</span>
                   <span className="font-weight-bold mr-3" onClick={()=>setOnEdit(false)}>Cancel</span>
                   </>:<span className="font-weight-bold mr-3" onClick={handleReply}>
                   {
                       reply?"Cancel":"Reply"
                   }</span>
               }
               
           </div>
        
           
           
           <div className={`d-flex align-align-items-center justify-content-center mr-2 comment_sub ${onEdit && "add"}`} >
        
        <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit}/>
        <LikeButton isLike={isLike} handleLike={handleLike} handleUnlike={handleUnlike} />
        </div>
        
         </div>
        </div> 
       

       {
           
           reply && <InputComment post={post}
           reply={reply}
           setOnReply={setOnReply}>
           <Link to={`/profile/${reply.user._id}`} style={{cursor:'pointer',color:'rgb(17, 87, 114)',fontWeight:"700"}}>
               @{reply.user.username+" "}
           </Link>
           </InputComment>
       }
       {children}
        </div>
       
        
    )
}

export default CommentCard
