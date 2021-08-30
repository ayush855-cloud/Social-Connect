import { Avatar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/profile.css';
import FollowBtn from './FollowBtn';
import {Link} from 'react-router-dom';

function SuggestUser({user,border,handleBoxClose,setShowFollowers,setShowFollowing}) {
  const {theme,auth}=useSelector(state=>state);
  const handleAll=()=>{
    if(handleBoxClose) handleBoxClose();
    if(setShowFollowers) setShowFollowers(false)
    if(setShowFollowing) setShowFollowing(false)
  }
    return (
    <div className={`d-flex align-items-center justify-content-between`} onClick={handleAll}>
            <div className="d-flex align-items-center">
            <Avatar src={user.avatar} size="big-avatar" className="avatar_style" style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />

            <Link to={`profile/${user._id}`} style={{textDecoration:'none'}}>
            <div className="d-flex flex-column mr-4" style={{color:'black'}}>
                <span className="d-block" style={{fontWeight:'600'}}>{user.username}</span>
                
                <span style={{opacity: 0.7}}>
                   
                        
                {
                    user.fullname.length<11 ? user.fullname:
                    user.fullname.slice(0,11)+'...'
                }
                        
                    
                </span>
            </div>
            </Link>
            </div>
            { auth.user._id!== user._id && <FollowBtn user={user}/>}
</div>
    )
}

export default SuggestUser
