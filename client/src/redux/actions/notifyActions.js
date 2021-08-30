import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData";

export const TYPE={
    NOTIFY:"NOTIFY",
    GET_NOTIFIES:'GET_NOTIFIES',
    CREATE_NOTIFY:'CREATE_NOTIFY',
    DELETE_NOTIFY:'DELETE_NOTIFY',
    UPDATE_NOTIFY:'UPDATE_NOTIFY',
    UPDATE_SOUND:"UPDATE_SOUND",
    DELETE_ALL_NOTIFICATION:"DELETE_ALL_NOTIFICATION",
};

export const createNotify=({msg,auth,socket})=>{
    return async(dispatch)=>{
        try {
            const res=await postDataAPI('notify',msg,auth.token);
            socket.emit('createNotify',{
                ...res.data.notify,
                user:{
                    username:auth.user.username,
                    avatar:auth.user.avatar
                }
            });
            
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const removeNotify=({msg,auth,socket})=>{
    return async(dispatch)=>{
        try {
           await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`,auth.token);
           socket.emit('removeNotify',msg);
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const getNotifies=(token)=>{
    return async(dispatch)=>{
        try {
           const res=await getDataAPI('notifies',token);
           
           dispatch({type:TYPE.GET_NOTIFIES,payload:res.data.notifies});
        
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const isReadNotify=({msg,auth})=>{
    return async(dispatch)=>{
        dispatch({type:TYPE.UPDATE_NOTIFY,payload:{...msg,isRead:true}});
        try {
            const res=await patchDataAPI(`isReadNotify/${msg._id}`,null,auth.token);
            console.log(res);
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
        }
    }
}


export const deleteAllNotifies=(token)=>{
    return async(dispatch)=>{
     dispatch({type:TYPE.DELETE_ALL_NOTIFICATION,payload:[]})
     try {
         await deleteDataAPI('deleteAllNotify',token);
     } catch (error) {
        dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
     }
    }
}