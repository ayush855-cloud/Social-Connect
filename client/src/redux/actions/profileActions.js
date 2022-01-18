import { getDataAPI,patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload.";
import { DeleteData } from "../type/globalType";
import { TYPES } from "./authActions";
import { createNotify, removeNotify, TYPE } from "./notifyActions";

export const SET_PROFILE="SET_PROFILE_USER";
export const FOLLOW="FOLLOW";
export const UNFOLLOW="UNFOLLOW";
export const STATUS="STATUS";
export const GET_ID="GET_PROFILE_ID";
export const GET_POSTS="GET_PROFILE_POSTS";
export const UPDATE_POST="UPDATE_PROFILE_POST";

export const getProfileUsers=({id,auth})=>{
    return async(dispatch)=>{
        dispatch({type:GET_ID,payload:id})
            try {
                dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
            const res=getDataAPI(`/user/${id}`,auth.token);

            const res1=getDataAPI(`/user_posts/${id}`,auth.token);
     
            const users=await res;
        const posts=await res1;

            dispatch({type:SET_PROFILE,payload:users.data});
            dispatch({type:GET_POSTS,payload:
                {...posts.data,_id:id,page:2}
            });
            dispatch({type:TYPE.NOTIFY,payload:{loading:false}});
            } catch (error) {
                dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
            }
    }

}

export const updateProfileUser=({userData,avatar,auth})=>{
      return async(dispatch)=>{
    
        if(userData.fullname?.length > 25)
        return dispatch({type: TYPE.NOTIFY, payload: {error: "Your full name too long."}})
    
        if(userData.story?.length > 200)
        return dispatch({type: TYPE.NOTIFY, payload: {error: "Your story too long."}})

        try {
            let media;
            dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
            if(avatar) media =await imageUpload([avatar]);
            console.log(media);
            const res=await patchDataAPI("user",{
                ...userData,
                avatar:avatar?media[0].url :auth.user.avatar
            },auth.token)
            console.log(res);
            dispatch({type:TYPE.NOTIFY,payload:{loading:false}});
            dispatch({type:TYPES.AUTH,payload:{...auth,user:{
                ...auth.user,...userData,
                avatar:avatar?media[0].url : auth.user.avatar,
            }}})
            dispatch({type: TYPE.NOTIFY, payload: {success: res.data.msg}})
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
      }
}

export const follow=({users,user,auth,socket})=>{
    // users all users 
    // user particular user who I want to follow
    // auth means who login 
    return async(dispatch)=>{
        // console.log(user); except me
        let newUser={...user,followers:[...user.followers,auth.user]};
        // console.log(newUser);
        dispatch({type:FOLLOW,payload:newUser});
        dispatch({type:TYPES.AUTH,payload:{
            ...auth,
            user:{
                ...auth.user,following:[...auth.user.following,newUser]
            }
        }});

       
        try {
          const res=await patchDataAPI(`user/${user._id}/follow`,null,auth.token);
          socket.emit('follow',res.data.newUser);

          const msg={
            id:auth.user._id,
            text: "has started to follow you",
            recipients: [newUser._id] ,
            url:`/profile/${auth.user._id}`,
            content:'',
        }

        dispatch(createNotify({msg,auth,socket}));
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const unfollow=({users,user,auth,socket})=>{
    return async(dispatch)=>{
        let newUser={...user,followers:DeleteData(user.followers,auth.user._id)};
        dispatch({type:UNFOLLOW,payload:newUser});
        dispatch({type:TYPES.AUTH,payload:{
            ...auth,
            user:{...auth.user,following: DeleteData(auth.user.following,newUser._id)}
        }})
        
        
             try {
           const res= await patchDataAPI(`user/${user._id}/unfollow`,null,auth.token);
           socket.emit('unfollow',res.data.newUser);
           const msg={
            id:auth.user._id,
            text: "has started to follow you",
            recipients: [newUser._id] ,
            url:`/profile/${auth.user._id}`,
            content:'',
            
        }

        dispatch(removeNotify({msg,auth,socket}));
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
        
    }
}