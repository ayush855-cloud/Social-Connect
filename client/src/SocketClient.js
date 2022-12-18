import React,{useEffect,useRef} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { TYPES } from './redux/actions/authActions';
import { TYPE } from './redux/actions/notifyActions';
import { POST_TYPES } from './redux/actions/postActions';
import audiobell from './audio/client_src_audio_got-it-done-613.mp3';
import { ADD_MESSAGE, ADD_USER } from './redux/actions/messageAction';
import { CALL, OFFLINE, ONLINE } from './redux/type/globalType';


const spawnNotification=(body,icon,url,title)=>{
    let options={
        body,icon
    }
    let n=new Notification(title,options)

    n.onclick=e=>{
        e.preventDefault();
        window.open(url,'_blank')
    }
}
function SocketClient() {
    const {auth,socket,alert,online,call} =useSelector(state=>state);
    const dispatch=useDispatch();
    const audioRef=useRef();

    // joinUser
    useEffect(()=>{
         socket.emit('joinUser',auth.user)
    },[socket,auth.user])

    // Likes
    useEffect(()=>{
        socket.on('likeToClient',newPost=>{
            dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost})
        });

        return ()=>socket.off('likeToClient')
    },[socket,dispatch])


useEffect(()=>{
        socket.on('unLikeToClient',newPost=>{
            dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost})
        });

        return ()=>socket.off('unLikeToClient')
    },[socket,dispatch])

useEffect(()=>{
    socket.on('createCommentToClient',newPost=>{
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost})
    })
    return ()=>socket.off('createCommentToClient')
},[dispatch,socket])    

useEffect(()=>{
    socket.on('deleteCommentToClient',newPost=>{
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost})
    })
    return ()=>socket.off('deleteCommentToClient')
},[dispatch,socket]) 

useEffect(()=>{
    socket.on('followToClient',newUser=>{
        dispatch({type:TYPES.AUTH,payload:
        {
            ...auth,
            user:newUser
        }})
    })
    return ()=>socket.off('followToClient')
},[dispatch,socket,auth]) 


useEffect(()=>{
    socket.on('unFollowToClient',newUser=>{
        dispatch({type:TYPES.AUTH,payload:
        {
            ...auth,
            user:newUser
        }})
    })
    return ()=>socket.off('unFollowToClient')
},[dispatch,socket,auth]) 

// Notifications


useEffect(()=>{
    socket.on('createNotifyToClient',msg=>{
        dispatch({type:TYPE.CREATE_NOTIFY,payload:msg})
        if(alert.sound) audioRef.current.play();
        spawnNotification(
            msg.user.username+'' + msg.text,
            msg.user.avatar,
            msg.url,
            'SOCIAL-CONNECT'
        )

    })
    return ()=>socket.off('createNotifyToClient')
},[dispatch,socket,alert.sound]) 

useEffect(()=>{
    socket.on('removeNotifyToClient',msg=>{
        dispatch({type:TYPE.DELETE_NOTIFY,payload:msg})
    })
    return ()=>socket.off('removeNotifyToClient')
},[dispatch,socket]) 

useEffect(()=>{
    socket.on('addMessageToClient',msg=>{
        dispatch({type:ADD_MESSAGE,payload:msg})
        dispatch({type:ADD_USER,payload:{...msg.user,text:msg.text,media:msg.media}});
    })
    return ()=>socket.off('addMessageToClient')
},[dispatch,socket])

// Check User Online/Offline
useEffect(()=>{
 socket.emit('checkUserOnline',auth.user);
},[socket,auth.user])

useEffect(()=>{
    socket.on('checkUserOnlineToMe',data=>{
      data.forEach(item=>{
          if(online.includes(item.id)){
              dispatch({type:ONLINE,payload:item.id});
          }
      })
    })
    return ()=>socket.off('checkUserOnlineToMe')
},[dispatch,socket,online])

useEffect(()=>{
    socket.on('checkUserOnlineToClient',id=>{
        if(!online.includes(id)){
            dispatch({type:ONLINE,payload:id})
        }
    })
     
    return ()=>socket.off('checkUserOnlineToClient')
},[dispatch,socket,online])

// check Offline
useEffect(()=>{
    socket.on('CheckUserOffline',id=>{
        dispatch({type:OFFLINE,payload:id})
    })
     
    return ()=>socket.off('CheckUserOffline')
},[dispatch,socket,online])

useEffect(()=>{
    socket.on('callUserToClient',data=>{
        // console.log(data);
        dispatch({type:CALL,payload:data})
    })
     
    return ()=>socket.off('callUserToClient')
},[dispatch,socket])



    useEffect(()=>{
   socket.on('userBusy',data=>{
       dispatch({type:TYPE.NOTIFY,payload:{error:`${call.username} is busy!!`}})
   })
   return ()=>socket.off('userBusy');
    },[socket,dispatch,call])

    return(
        <>
        <audio controls ref={audioRef} style={{display:'none'}}>
            <source src={audiobell} type="audio/mp3"/>
        </audio>
        </>
    )
}

export default SocketClient
