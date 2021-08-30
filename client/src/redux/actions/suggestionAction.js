import { getDataAPI } from "../../utils/fetchData";
import { TYPE } from "./notifyActions"

export const SUGGEST_TYPES={
    GET_USERS:"GET_USERS_SUGGES"
}


export const getSuggestions=(token)=>{
    return async(dispatch)=>{
        try {
            dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
            const res=await getDataAPI('suggestionsUser',token);
            
           dispatch({type:SUGGEST_TYPES.GET_USERS,payload:res.data}); 
           dispatch({type:TYPE.NOTIFY,payload:{loading:false}});
        } catch (error) {
            dispatch({type:TYPE.NOTIFY,payload:{error:error.response.data.msg}});
        }
    }
}