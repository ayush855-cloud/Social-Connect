import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NoNotice from '../images/notice.png';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import { deleteAllNotifies, isReadNotify, TYPE } from '../redux/actions/notifyActions';

function NotifyModal() {
    const { auth, alert,theme } = useSelector(state => state);
    const dispatch = useDispatch();

    const handleIsRead=(msg)=>{
        dispatch(isReadNotify({msg,auth}))
    }

    const handleSound=()=>{
      dispatch({type:TYPE.UPDATE_SOUND,payload:!alert.sound});
    }

    const handleDelete=()=>{
        const newArr=alert.data.filter(item=>item.isRead===false)
        if(newArr.length===0) return dispatch(deleteAllNotifies(auth.token))

        if(window.confirm(`You have ${newArr.length} unread notifications.Are you sure you want to delete all?`)){
            return dispatch(deleteAllNotifies(auth.token))
        }
    }
    return (
        <div style={{ minWidth: '320px' }}>
            <div className="d-flex justify-content-between align-items-center px-3">
                <h3 style={{ fontWeight: '600', color: 'rgb(17, 87, 114)', fontFamily: 'Poppins', letterSpacing: '1px',filter:theme?'invert(1)':'invert(0)' }}>Notification</h3>
                {
                    alert.sound ? <NotificationsActiveIcon className="text-danger" style={{ fontSize: '1.5rem', cursor: 'pointer', position: 'relative', top: '-0.1rem',filter:theme?'invert(1)':'invert(0)' }} 
                        onClick={handleSound}
                    />
                        : <NotificationsOffIcon className="text-danger" style={{ fontSize: '1.5rem', cursor: 'pointer', position: 'relative', top: '-0.1rem',filter:theme?'invert(1)':'invert(0)' }}
                         onClick={handleSound}
                         />
                }
            </div>
            
            {
                alert.data.length === 0 &&
                <img src={NoNotice} alt="Bell Icon" className="w-100" />
            }
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }} className="notifications">
                {
                    alert.data.map((msg, index) => (
                        <div key={index} className="px-2 py-3"  style={{backgroundColor : msg.isRead ? 'white' : '#e7ecef'  }}>
                            <Link to={`${msg.url}`} className="d-flex align-items-center text-dark" onClick={()=>handleIsRead(msg)}
                           
                            >
                                <Avatar src={msg.user.avatar} className="notification_avatar" style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                                <div>
                                    <div >
                                        <div className="mr-1 notification_details">
                                            <strong className="notify_username">{msg.user.username}</strong>
                                            <span className="ml-2 notify-text">{msg.text}</span>

                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: "rgb(17, 87, 114)", fontWeight: '600',filter:theme?'invert(1)':'invert(0)' }}>{msg.content && msg.content.slice(0, 20)}...</span>
                                    </div>
                                </div>
                                <div style={{position:'absolute', right:'0.5rem'}}>
                                    {msg.image && <Avatar src={msg.image} style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>}
                                </div>
                              

                            </Link>
                            <span className="notify-text d-flex justify-content-between align-items-center px-3 w-100">{moment(msg.createdAt).fromNow()}
                                {
                                    !msg.isRead && <i className="fas fa-circle" style={{position:'relative',right:'-0.2rem',color:'rgb(17, 87, 114)',filter:theme?'invert(1)':'invert(0)'}} />
                                }
                            </span>
                          
                        </div>

                    ))
                }
              
            </div>
            <hr className="mt-0"/>
            <div className="text-right mr-3" style={{fontFamily:'Poppins',fontWeight:'800',color:'red',filter:theme?'invert(1)':'invert(0)'}} onClick={handleDelete}>
                Delete All
            </div>
        </div>
    )
}

export default NotifyModal
