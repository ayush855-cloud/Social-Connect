import { Avatar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/profile.css';

function SearchCard({user,border,handleBoxClose,setShowFollowers,setShowFollowing}) {
  const {theme}=useSelector(state=>state);
  const handleAll=()=>{
    if(handleBoxClose) handleBoxClose();
    if(setShowFollowers) setShowFollowers(false)
    if(setShowFollowing) setShowFollowing(false)
  }
    return (
         <div className={`d-flex align-items-center justify-content-between w-100`} onClick={handleAll}>
            
            <Avatar src={user.avatar} size="big-avatar" className="avatar_style" style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />

            <div className="d-flex flex-column position-fixed" style={{left:'5rem',color:'black'}}>
                <span className="d-block" style={{fontWeight:'600'}}>{user.username}</span>
                
                <span style={{opacity: 0.7}}>
                   
                        { user.fullname}
                    
                </span>
            </div>
</div>
    )
}

export default SearchCard
