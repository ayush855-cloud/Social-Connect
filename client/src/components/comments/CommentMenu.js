import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import {useDispatch,useSelector } from 'react-redux';
import { deleteComment } from '../../redux/actions/commentActions';

function CommentMenu({post,comment,setOnEdit}) {
   const {auth,socket}=useSelector(state=>state);
    const dispatch=useDispatch();
    const handleRemove=()=>{
        if(post.user._id===auth.user._id || comment.user._id===auth.user._id){
            dispatch(deleteComment({post,auth,comment,socket}));
        }
     
    }
    const MenuItem=()=>{
        return(
            <>
                <div className="dropdown-item" onClick={()=>setOnEdit(true)}>
                    <span className="material-icons"><CreateIcon/></span> Edit
                </div>
                <div className="dropdown-item" onClick={handleRemove}>
                    <span className="material-icons"><DeleteIcon/></span> Remove
                </div>
            </>
        )
    }
    return (
        <div className="commentMenu">
        {
            (post.user._id === auth.user._id || comment.user._id === auth.user._id) &&
            <div className="nav-item dropdown">
                <span className="material-icons" id="moreLink" data-toggle="dropdown">
                    <MoreVertIcon/>
                </span>

                <div className="dropdown-menu" aria-labelledby="moreLink">
                    {
                        post.user._id === auth.user._id
                        ? comment.user._id === auth.user._id
                            ? MenuItem()
                            : <div className="dropdown-item" >
                                <span className="material-icons"><DeleteIcon/></span> Remove
                            </div>
                        : comment.user._id === auth.user._id && MenuItem()
                    }
                </div>

            </div>
        }
        
    </div>
    )
}

export default CommentMenu
