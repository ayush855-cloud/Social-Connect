import {TYPE} from '../actions/notifyActions';
import { EditData } from '../type/globalType';

const initialState={
    loading:false,
    data:[],
    sound:false
}

const alertReducer=(state=initialState,action)=>{
    switch(action.type){
        case TYPE.GET_NOTIFIES:
            return {
                ...state,
                data:action.payload
            }
        case TYPE.CREATE_NOTIFY:
            return {
                ...state,
                data:[action.payload,...state.data]
            }
            case TYPE.DELETE_NOTIFY:
                return {
                    ...state,
                    data:state.data.filter(item=>(item.id !== action.payload.id || item.url !==action.payload.url))
                }    
        case TYPE.UPDATE_NOTIFY:
            return{
                ...state,
                data:EditData(state.data,action.payload._id,action.payload)
            } 
        case TYPE.UPDATE_SOUND:
            return {
                ...state,
                sound:action.payload
            }  
            case TYPE.DELETE_ALL_NOTIFICATION:
                return {
                    ...state,
                    data:action.payload
                }          
        default:
            return state;         
    }
}

export default alertReducer;