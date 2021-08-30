import React,{useState} from 'react';

import UserCard from './UserCard';
import '../styles/profile.css';
import Switch from '@material-ui/core/Switch';

function Followers({users,setShowFollowers}) {
    
    const [state] =useState({
        checkedA: true,
        checkedB: true,
    });
    return (
        <div className="follow">
       
        <div className="follow_box">
        <h5 style={{color:'rgb(17, 87, 114)',fontWeight:'700'}}>Followers</h5>
        {
            users.map(user=>(
                <UserCard key={user._id} user={user} setShowFollowers={setShowFollowers}>
                </UserCard>
            ))
        }
        <Switch
                className="switch"
                color="primary"
                checked={state.checkedA}
                // onChange={handleChange}
                onClick={()=>setShowFollowers(false)}
                name="checkedA"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
        </div>
            
        </div>
    )
}

export default Followers
