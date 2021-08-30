// import axios from 'axios';
import {TYPE} from './notifyActions';
import { postDataAPI } from '../../utils/fetchData';
import valid from '../../utils/valid';
export const TYPES={
    AUTH:"AUTH"
};
export const THEME="THEME";


export const login=(data)=>{
   return async(dispatch)=>{
     try {
         dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
         const res=await postDataAPI("login",data);
         
         dispatch({type:TYPES.AUTH,payload:{token:res.data.access_token,user:res.data.user}});
         localStorage.setItem("firstLogin",true);
         dispatch({type:TYPE.NOTIFY,payload:{success:res.data.msg}});
     } catch (err) {
         dispatch({type:TYPE.NOTIFY,payload:{error:err.response.data.msg}});
     }
   }
    
}

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")
    if(firstLogin)
        dispatch({ type: TYPE.NOTIFY, payload: {loading: true} })
        try {
            const res = await postDataAPI('refresh_token')
            dispatch({ 
                type: TYPES.AUTH, 
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })

            dispatch({ type: TYPE.NOTIFY, payload: {} })

        } catch (err) {
            dispatch({ 
                type: TYPE.NOTIFY, 
                payload: {
                    error: err.response.data.msg
                } 
            })
        }
    
}


export const register=(data)=>{
    return async(dispatch)=>{
                    
        const check=valid(data);
        if(check.errLength>0){
            return dispatch({type:TYPE.NOTIFY,payload:check.errMsg});
        }
        try {
            dispatch({type:TYPE.NOTIFY,payload:{loading:true}});
            const res=await postDataAPI("register",data);
            dispatch({type:TYPES.AUTH,payload:{token:res.data.access_token,user:res.data.user}});
            localStorage.setItem("firstLogin",true);
            dispatch({type:TYPE.NOTIFY,payload:{success:res.data.msg}});
           
        } catch (err) {
            dispatch({type:TYPE.NOTIFY,payload:{error:err.response.data.msg}});
        }
    }
}

export const logout=()=>{
    return async(dispatch)=>{
        try {
            localStorage.removeItem("firstLogin");
            await postDataAPI("logout");
            window.location.href="/";
        } catch (err) {
            dispatch({type:TYPE.NOTIFY,payload:{error:err.response.data.msg}});
        }
    }
}