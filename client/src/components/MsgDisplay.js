import { Avatar } from '@material-ui/core'
import React from 'react'
import { imageShow, videoShow } from '../utils/mediaShow';
import {useSelector,useDispatch} from 'react-redux'
import { deleteMessages } from '../redux/actions/messageAction';
import Times from './Times';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import CallIcon from '@material-ui/icons/Call';
import CameraFrontIcon from '@material-ui/icons/CameraFront';

function MsgDisplay({ user, msg, theme, data }) {
    const dispatch=useDispatch();
    const {auth}=useSelector(state=>state);

    const handleDeleteMessages=()=>{
        if(window.confirm('Do you want to delete?')){
            dispatch(deleteMessages({msg, data, auth}))
        }
    }
    return (
        <>
            <div className="chat_title">
                <Avatar src={user.avatar} className="message_avatar" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
                <span>{user.username}</span>
            </div>
            <div className="my_content">

            { 
                    user._id === auth.user._id && 
                    <i className="fas fa-trash" onClick={handleDeleteMessages}/>
                   
                }

                <div>
                    {
                        msg.text && <div className="chat_text" style={{
                        filter: theme ? 'invert(1)' : 'invert(0)'
                    }}>
                        {msg.text}
                    </div>
                    }

                    {
                        msg.media.map((item, index) => (
                            <div key={index} className="set_images">
                                {
                                    item.url.match(/video/i) ?
                                        videoShow(item.url, theme) :
                                        imageShow(item.url, theme)
                                }

                            </div>
                        ))
                    }
                </div>
            {
                msg.call && <button className="btn d-flex align-items-center py-3" style={{
                    background:'#eee',borderRadius:'10px',width:'auto'
                }}>
                <span className="material_icon font-weight-bold mr-1" style={{
                    fontSize:'2.5rem',color:msg.call.times ===0 ? 'crimson':"green",filter:theme?'invert(1)':'invert(0)'
                }}>
                {
                    msg.call.times === 0 ? msg.call.video ? <VideocamOffIcon/> : <PhoneDisabledIcon/>
                    : msg.call.video ? <CameraFrontIcon style={{position:'relative',top:'-0.5rem'}}/>: <CallIcon/>
                }

                </span>

                <div className="text-left">
                    <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
                    <span>
                        {
                            msg.call.times > 0
                            ? <Times total={msg.call.times}/> :
                            new Date(msg.createdAt).toLocaleTimeString()
                        }
                    </span>
                </div>

                </button>
            }

            </div>


            <div className="chat_time">
                {new Date(msg.createdAt).toLocaleString()}
            </div>
        </>
    )
}

export default MsgDisplay
