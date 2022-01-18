import { Avatar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/profile.css';

function SuggestUserModal({user,border,handleBoxClose,setShowFollowers,setShowFollowing}) {
  const {theme}=useSelector(state=>state);
  const handleAll=()=>{
    if(handleBoxClose) handleBoxClose();
    if(setShowFollowers) setShowFollowers(false)
    if(setShowFollowing) setShowFollowing(false)
  }
    return (
         <div className={`d-flex align-items-center justify-content-between my-3`} style={{width:'fit-content'}} onClick={handleAll}>
            
            <Avatar src={user.avatar} size="big-avatar" className="avatar_style" style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />

            <div className="d-flex flex-column" style={{color:'black'}}>
                <span className="d-block" style={{fontWeight:'600'}}>{user.username}</span>
                
                <span style={{opacity: 0.7}}>
                   
                        { user.fullname}
                    
                </span>
            </div>
            
</div>
    )
}

export default SuggestUserModal
