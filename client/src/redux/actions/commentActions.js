
import { deleteDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData";
import { DeleteData, EditData } from "../type/globalType";
import { createNotify, removeNotify, TYPE } from "./notifyActions";
import { POST_TYPES } from "./postActions";


export const createComment=({post,newComment,auth,socket})=>{
    return async(dispatch)=>{
        const newPost={...post,comments:[...post.comments,newComment]};
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost});
        try {
            const data={...newComment,postId:post._id,postUserId:post.user._id}
            const res=await postDataAPI('comment',data,auth.token);
            
            const newData={...res.data.newComment,user:auth.user};
            const newPost={...post,comments:[...post.comments,newData]};
            dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost});

            socket.emit('createComment',newPost);
            const msg={
                id:res.data.newComment._id,
                text: newComment.reply ? "mentioned you in a comment":"has commented on your post.",
                recipients: newComment.reply ? [newComment.tag._id] : [post.user._id] ,
                url:`/post/${post._id}`,
                content:res.data.newComment.content
                ,image:post.images[0].url
            }

            dispatch(createNotify({msg,auth,socket}));

        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const updateComment=({comment,post,content,auth})=>{
    return async(dispatch)=>{
        const newComments=EditData(post.comments,comment._id,{...comment,content});
        const newPost={...post,comments:newComments};
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost});
        try {
           await patchDataAPI(`comment/${comment._id}`,{content},auth.token);
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}

export const likeComment=({post,auth,comment})=>{
    return async(dispatch)=>{
         const newComment={...comment,likes:[...comment.likes,auth.user]};
         const newComments=EditData(post.comments,comment._id,newComment);
        const newPost={...post,comments:newComments};
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost});
         try {
            await patchDataAPI(`comment/${comment._id}/like`,null,auth.token);
         } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
         }
    }
}

export const unlikeComment=({post,auth,comment})=>{
    return async(dispatch)=>{
         const newComment={...comment,likes:DeleteData(comment.likes,auth.user._id)};
         const newComments=EditData(post.comments,comment._id,newComment);
        const newPost={...post,comments:newComments};
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost});
         try {
            await patchDataAPI(`comment/${comment._id}/unlike`,null,auth.token);
         } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
         }
    }
}


export const deleteComment=({post,comment,auth,socket})=>{
    return async(dispatch)=>{
        const deleteArr=[...post.comments.filter(cm=>cm.reply===comment._id),comment];
        const newPost={
            ...post,
            comments:post.comments.filter(cm=>!deleteArr.find(da=>cm._id===da._id))
            
        }
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost});
        // if not patch but u can test them but not save in database

        socket.emit('deleteComment',newPost);
        try {
            deleteArr.forEach(item=>{
                deleteDataAPI(`comment/${item._id}`,auth.token)
                const msg={
                    id:item._id,
                    text: comment.reply ? "mentioned you in a comment":"has commented on your post.",
                    recipients: comment.reply ? [comment.tag._id] : [post.user._id] ,
                    url:`/post/${post._id}`
                }
    
                dispatch(removeNotify({msg,auth,socket}));
            })
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
        }
    }
}