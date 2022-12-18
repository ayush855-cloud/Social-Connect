import React,{useEffect,useState} from 'react'
import Info from '../../components/Info'

import '../../styles/profile.css';
import {useSelector,useDispatch} from 'react-redux';
import Loading from '../../components/Loading';
import {useParams} from 'react-router-dom';
import { getProfileUsers } from '../../redux/actions/profileActions';
import PersonalPost from '../../components/PersonalPost';
import Saved from '../../components/Saved';

function Profile() {
    const {notify,auth,profile,theme,status,modal} =useSelector(state=>state);
    const {id}=useParams();
    const [saveTab,setSaveTab]=useState(false);
    const dispatch=useDispatch();

    useEffect(()=>{
        if(profile.ids.every(item=>item!==id)){
            dispatch(getProfileUsers({ id, auth }));
        }   
    },[id,auth,profile.ids,dispatch])

    return (
        <div className="profile">
            <Info auth={auth}  profile={profile} dispatch={dispatch} id={id}/>
            {
                auth.user._id===id && 
                <div className={`profile_tab ${(modal || status) && "close_profile_tab"}`}>
                    <button className={saveTab? '' : 'active'} onClick={()=>setSaveTab(false)} style={{filter:theme?'invert(1)':'invert(0)',background:'none'}}>Posts</button>
                    <button className={saveTab? 'active' : ''} onClick={()=>setSaveTab(true)} style={{filter:theme?'invert(1)':'invert(0)',background:'none'}}>Saved</button>
                </div>
            }
            
            {
                
            notify.loading? <Loading/> : <>
            {
                saveTab ? <Saved auth={auth} 
                    dispatch={dispatch} /> :
                <PersonalPost auth={auth} 
                    profile={profile} dispatch={dispatch} id={id}/>
            }
            </>
            }

        </div>
    )
}

export default Profile
