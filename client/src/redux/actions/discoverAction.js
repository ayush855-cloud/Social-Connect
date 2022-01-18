import { getDataAPI } from "../../utils/fetchData";
import { TYPE } from "./notifyActions"



export const DISCOVER_TYPES={
    GET_POSTS:"GET_DISCOVER_POSTS",
    UPDATE_POSTS:"UPDATE_DISCOVER_POSTS"
}


export const getDiscoverPosts=(token)=>{
    return async(dispatch)=>{
        try {
            dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
            const res=await getDataAPI('post_discover',token);
            dispatch({type:DISCOVER_TYPES.GET_POSTS,payload:res.data});
           
            dispatch({type:TYPE.NOTIFY,payload:{loading:false}});
        } catch (error) {
           dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}}); 
        }
    }
}