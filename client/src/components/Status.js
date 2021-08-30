import { Avatar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/home.css';
import {useDispatch} from 'react-redux';
import { STATUS } from '../redux/actions/profileActions';


function Status() {
    const {auth,theme}=useSelector(state=>state);
    const dispatch=useDispatch();
    return (
        <div className="status my-3 d-flex">
            <Avatar src={auth.user.avatar} className="status_avatar" style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
            <button className="statusBtn flex-fill" onClick={()=>dispatch({type:STATUS,payload:true})} style={{filter: theme ? 'invert(1)' : 'invert(0)'}}>
                {auth.user.username},what are you thinking?
            </button>
        </div>
    )
}

export default Status
