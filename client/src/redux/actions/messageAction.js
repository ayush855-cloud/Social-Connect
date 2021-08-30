import { deleteDataAPI, getDataAPI, postDataAPI } from "../../utils/fetchData";
import { DeleteData } from "../type/globalType";
import { TYPE } from "./notifyActions";

export const ADD_USER="ADD_USER";
export const ADD_MESSAGE='ADD_MESSAGE';
export const GET_CONVERSATIONS="GET_CONVERSATIONS";
export const GET_MESSAGES='GET_MESSAGES';
export const UPDATE_MESSAGE='UPDATE_MESSAGE';
export const DELETE_MESSAGE='DELETE_MESSAGE';
export const DELETE_CONVERSATION="DELETE_CONVERSATION";
export const CHECK_ONLINE_OFFLINE="CHECK_ONLINE_OFFLINE";




export const addMessage=({msg,auth,socket})=>{
    return async(dispatch)=>{
        dispatch({type:ADD_MESSAGE,payload:msg});
        const {_id,username,fullname,avatar}=auth.user;
        socket.emit('addMessage',{...msg,user:{_id,username,fullname,avatar}});
        try {
            await postDataAPI('message',msg,auth.token);
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const getConversations=({auth,page=1})=>{
    return async(dispatch)=>{
     try {
         const res=await getDataAPI(`conversations?limit=${page * 9}`,auth.token);
         let newArr=[];
         res.data.conversations.forEach(item=>(
             item.recipients.forEach(cv=>{
                 if(cv._id !== auth.user._id){
                     newArr.push({...cv,text:item.text,media:item.media,call:item.call});
                 }
                })
         ))
         dispatch({type:GET_CONVERSATIONS,payload:
        {newArr,result:res.data.result}
        });
       
     } catch (error) {
        dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
     }
    }
}

export const getMessages=({auth,id,page=1})=>{
    return async(dispatch)=>{
        try {
            const res=await getDataAPI(`message/${id}?limit=${page * 9}`,auth.token);
            const newData={...res.data,messages:res.data.messages.reverse()};
            
            dispatch({type:GET_MESSAGES,payload:{...newData,_id:id,page}});
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
       

    }
}


export const loadMoreMessages=({auth,id,page=1})=>{
    return async(dispatch)=>{
        try {
            const res=await getDataAPI(`message/${id}?limit=${page * 9}`,auth.token);
            const newData={...res.data,messages:res.data.messages.reverse()};
            
            dispatch({type:UPDATE_MESSAGE,payload:{...newData,_id:id,page}});
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const deleteMessages=({ msg,auth,data})=>{
    return async(dispatch)=>{
             const newData=DeleteData(data,msg._id);
             dispatch({type:DELETE_MESSAGE,payload:{
                 newData,
                 _id:msg.recipient
             }})

             try {
                 await deleteDataAPI(`message/${msg._id}`,auth.token);
             } catch (error) {
                dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
             }
    }
}

export const deleteConversation=({auth,id})=>{
    return async(dispatch)=>{
        dispatch({type:DELETE_CONVERSATION,payload:id});
        try {
            await deleteDataAPI(`conversations/${id}`,auth.token);
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
        }
    }
}