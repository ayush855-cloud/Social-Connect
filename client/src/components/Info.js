import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import EditProfile from './EditProfile';
import FollowBtn from './FollowBtn';
import Following from './Following';
import Followers from './Followers';
import Tooltip from '@material-ui/core/Tooltip';
import { MODAL } from '../redux/type/globalType';

// import Backdrop from '@material-ui/core/Backdrop';

function Info({auth,dispatch,profile,id}) {
    
    const { theme } = useSelector(state => state);
    
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [userData, setUserData] = useState([]);
    const [onEdit, setOnEdit] = useState(false);


    useEffect(() => {
        if (id === auth.user._id) {
            setUserData([auth.user]);
        }
        else {
        
            const newData = profile.users.filter(user => user._id === id);
            setUserData(newData);
        }
    }, [id, auth, dispatch, profile.users])

    useEffect(()=>{
        if(showFollowers || showFollowing || onEdit){
            dispatch({type:MODAL,payload:true});
        }
        else{
            dispatch({type:MODAL,payload:false});
        }
    },[showFollowers,dispatch,showFollowing,onEdit])
    return (
        <div className="info">
            {
                userData?.map((user) => (
                    <div className="info_container" key={user._id}>
                        <Avatar src={user.avatar} className="user__avatar" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
                        <div className="info__content">
                            <div className="info__content__title">
                                <h2>{user.username}</h2>
                                {user._id === auth.user._id ? (

                                    <button className="btn btn-outline-info" onClick={() => setOnEdit(!onEdit)}>Edit Profile</button>

                                ) : <FollowBtn user={user} />}
                            </div>

                            <div className="follow_btn" style={{filter:theme?'invert(1)':'invert(0)'}}>
                                <Tooltip title="Click to check Followers">
                                <span className="mr-4" onClick={() => setShowFollowers(true)} >
                                    {user.followers?.length} Followers
                                </span>
                                </Tooltip>
                                <Tooltip title="Click to check Following">
                                <span className="ml-4" onClick={() => setShowFollowing(true)}>
                                    {user.following?.length} Following
                                </span>
                                </Tooltip>
                                <h6 className="mt-2" style={{filter:theme?'invert(1)':'invert(0)'}}>{user.fullname}<span className="ml-4">{user.mobile}</span> </h6>
                                <p className="m-0" style={{filter:theme?'invert(1)':'invert(0)'}}
                                className="profile_address">{user.address}</p>
                                <h6 style={{filter:theme?'invert(1)':'invert(0)'}} >{user.email}</h6>
                                <a href={user.website} target="_blank" rel="noreferrer" className="user_website">
                                    {user.website}
                                </a>
                                <p style={{filter:theme?'invert(1)':'invert(0)'}} className="user_story">{user.story}</p>
                            </div>
                        </div>

                        {onEdit && <EditProfile setOnEdit={setOnEdit} />}
                        {showFollowers && <Followers users={user.followers} setShowFollowers={setShowFollowers} />}
                        {showFollowing && <Following users={user.following} setShowFollowing={setShowFollowing} />}
                    </div>
                ))
            }
        </div>
    )
}

export default Info
