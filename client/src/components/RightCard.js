import { Avatar } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/profile.css';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


function RightCard({user,children}) {
    const history=useHistory();
    const handleMessage=()=>{
        return history.push("/message");
    }
    

    return (
    <div className={`d-flex align-items-center justify-content-between right_message w-100 px-2`}>
    <div className="d-flex justify-content-center align-items-center">
    <ArrowBackIcon className="arrow_exist" onClick={handleMessage}/>
            <div className="d-flex align-items-center ml-2">
            
            <Avatar src={user.avatar}  className="avatar_style" />

            
            <div className="d-flex flex-column mr-4 shift_details_user" >
                <span className="d-block username" style={{fontWeight:'700',fontSize:'1.2rem',marginTop:'-0.4rem'}}>{user.username}</span>
                
                <span className="fullname" style={{opacity: '1',letterSpacing:'0.5px',fontSize:'1rem'}}> 
                {user.fullname}      
                </span>
                
            </div>
            
            </div>
    </div>
   
            {children}
           
</div>
    )
}

export default RightCard
