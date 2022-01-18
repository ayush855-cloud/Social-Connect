import React,{useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { follow, unfollow } from '../redux/actions/profileActions';

function FollowBtn({user}) {
    const dispatch=useDispatch();
    const {auth,profile,socket}=useSelector(state=>state);
    const [followed,setFollowed]=useState(false);

    useEffect(()=>{
         if(auth.user.following.find(item=>item._id===user._id)){
             setFollowed(true);
         }
         return ()=>setFollowed(false)
    },[auth.user.following,user._id])

    
    const handlefollow=()=>{
        setFollowed(true);
        dispatch(follow({users:profile.users,user,auth,socket}));
    }


    const handleUnfollow=()=>{
        setFollowed(false);
        dispatch(unfollow({users:profile.users,user,auth,socket}));
    }
    return (
        <>
        {
            followed? <button className="btn btn-outline-info" onClick={handleUnfollow}>
                Unfollow
            </button>
            : <button className="btn btn-outline-info" onClick={handlefollow}>
                Follow
            </button>
        }
       </>
    )
}

export default FollowBtn
