import { Avatar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/profile.css';
import FollowBtn from './FollowBtn';

function UserCard({user,border,handleBoxClose,setShowFollowers,setShowFollowing}) {
  const {theme,auth}=useSelector(state=>state);
  const handleAll=()=>{
    if(handleBoxClose) handleBoxClose();
    if(setShowFollowers) setShowFollowers(false)
    if(setShowFollowing) setShowFollowing(false)
  }
    return (
    <div className={`d-flex align-items-center justify-content-between w-100`} onClick={handleAll}>
            
            <Avatar src={user.avatar} size="big-avatar" className="avatar_style" style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />

            <div className="d-flex flex-column position-fixed" style={{left:'5rem',color:'black'}}>
                <span className="d-block" style={{fontWeight:'600'}}> {
                    user.username?.length<10 ? user.username:
                    user.username?.slice(0,10)+'...'
                }</span>
                
                <span style={{opacity: 0.7}}>
                   
                        
                {
                    user.fullname?.length<10 ? user.fullname:
                    user.fullname?.slice(0,10)+'...'
                }
                        
                    
                </span>
            </div>
            { auth.user._id!== user._id && <FollowBtn user={user}/>}
</div>
    )
}

export default UserCard
