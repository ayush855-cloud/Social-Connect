import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload.";
import { TYPES } from "./authActions";
import { createNotify, TYPE,removeNotify } from "./notifyActions";


export const POST_TYPES={
    CREATE_POST:'CREATE_POST',
    LOADING_POSTS:'LOADING POSTS',
    GET_POSTS:'GET_POSTS',
    UPDATE_POST:'UPDATE_POST',
    GET_POST:"GET_POST",
    DELETE_POST:"DELETE_POST"
}

export const createPost=({content,images,auth,socket})=>{
    return async(dispatch)=>{
        
        let media=[];
        try {
            dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
            if(images.length>0)
            media=await imageUpload(images);
            
            const res=await postDataAPI('posts',{content,images:media},auth.token);
       
          
            dispatch({type:POST_TYPES.CREATE_POST,payload:{...res.data.newPost,user:auth.user}});
            dispatch({type:TYPE.NOTIFY,payload:{loading:false}});

            const msg={
                id:res.data.newPost._id,
                text:"added a new post.",
                recipients:res.data.newPost.user.followers,
                url:`/post/${res.data.newPost._id}`,
                content,image:media[0].url
            }

            dispatch(createNotify({msg,auth,socket}));
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}


export const getPosts=(token)=>{
    return async(dispatch)=>{
        dispatch({type:POST_TYPES.LOADING_POSTS,payload:true});
        try {

            const res=await getDataAPI('posts',token);
            
            dispatch({type:POST_TYPES.GET_POSTS,payload:{...res.data,page:2}});
            dispatch({type:POST_TYPES.LOADING_POSTS,payload:false});
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});   
            
        }
    }
}

export const updatePost=({content,images,auth,status})=>{
    return async(dispatch)=>{
        let media=[],imgNewUrl,imgOldUrl;

        imgNewUrl=images.filter(img=>!img.url);
        imgOldUrl=images.filter(img=>img.url);
        if(status.content===content && imgNewUrl.length===0 && imgOldUrl.length===status.images.length)
        return;
        try {
            dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
            if(imgNewUrl.length>0) media=await imageUpload(imgNewUrl);

            const res=await patchDataAPI(`post/${status._id}`,{
                content,images:[...imgOldUrl,...media]
            },auth.token)
            console.log(res);
            dispatch({type:POST_TYPES.UPDATE_POST,payload:res.data.newPost});
            dispatch({type:TYPE.NOTIFY,payload:{success:res.data.msg}});
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});   
           
        }
    }

}


export const likePost=({post,auth,socket})=>{
    return async(dispatch)=>{
        const newPost={...post,likes:[...post.likes,auth.user]};
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost})
        socket.emit('likePost',newPost);
        
        try {
            await patchDataAPI(`post/${post._id}/like`,null,auth.token);
            const msg={
                id:auth.user._id,
                text:"liked your post.",
                recipients:[post.user._id],
                url:`/post/${post._id}`,
                content:post.content
                ,image:post.images[0].url
            }

            dispatch(createNotify({msg,auth,socket}));
            
           
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});   
        }
    }
}

export const unlikePost=({post,auth,socket})=>{
    return async(dispatch)=>{
        const newPost={...post,likes:post.likes.filter(like=>like._id !==auth.user._id)};
        dispatch({type:POST_TYPES.UPDATE_POST,payload:newPost})

        socket.emit('unLikePost',newPost);
        try {
            await patchDataAPI(`post/${post._id}/unlike`,null,auth.token);

            const msg={
                id:auth.user._id,
                text:"liked your post.",
                recipients:[post.user._id],
                url:`/post/${post._id}`   
            }
    
            dispatch(removeNotify({msg,auth,socket}));
           
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});   
        }
    }
}

export const getPost=({detailPost,id,auth})=>{
    return async(dispatch)=>{
        if(detailPost.every(post=>post._id !==id)){
            try {
                const res=await getDataAPI(`post/${id}`,auth.token);
                dispatch({type:POST_TYPES.GET_POST,payload:res.data.post});
            } catch (error) {
                dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});   
            }
        }
    }
}


export const deletePost=({post,auth,socket})=>{
    return async(dispatch)=>{
        dispatch({type:POST_TYPES.DELETE_POST,payload:post})
      try {
         const res= await deleteDataAPI(`post/${post._id}`,auth.token);
         
         const msg={
            id:post._id,
            text:"added a new post.",
            recipients:res.data.newPost.user.followers,
            url:`/post/${post._id}` 
        }

        dispatch(removeNotify({msg,auth,socket}));
      } catch (error) {
        dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});   
      }
    }
}

export const savedPost=({post,auth})=>{
    return async(dispatch)=>{
        const newUser={...auth.user,saved:[...auth.user.saved,post._id]};
        dispatch({type:TYPES.AUTH,payload:{...auth,user:newUser}});
        try {
            await patchDataAPI(`savedPost/${post._id}`,null,auth.token);

        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});    
        }
    }
}

export const unSavedPost=({post,auth})=>{
    return async(dispatch)=>{
        const newUser={...auth.user,saved:auth.user.saved.filter(id=>id !== post._id)};
        dispatch({type:TYPES.AUTH,payload:{...auth,user:newUser}});
        try {
            await patchDataAPI(`unsavedPost/${post._id}`,null,auth.token);

        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});    
        }
    }
}