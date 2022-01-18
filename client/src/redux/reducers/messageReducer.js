import { ADD_MESSAGE, ADD_USER, CHECK_ONLINE_OFFLINE, DELETE_CONVERSATION, DELETE_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES, UPDATE_MESSAGE } from "../actions/messageAction";
import { DeleteData, EditData} from '../type/globalType';



const initialState={
    users:[],
    resultUser:0,
    data:[],
    
    firstLoad:false
}


const messageReducer=(state=initialState,action)=>{
    switch(action.type){
        case ADD_USER:
            if(state.users.every(item=>item._id !== action.payload._id)){
                return{
                    ...state,
                    users:[action.payload,...state.users]
                }
            }
        return state;
        case ADD_MESSAGE:
            return{
                ...state,
                data:state.data.map(item=>
                    item._id === action.payload.recipient || item._id === action.payload.sender ?
                    {...item,
                        messages:[...item.messages,action.payload],
                        result:item.result+1
                    } : item
                    ),
                users:state.users.map(user=>
                    user._id === action.payload.recipient || user._id === action.payload.sender ?
                    { ...user,text:action.payload.text,media:action.payload.media,
                    call:action.payload.call
                    }
                    :user
                    )
            } ;  
            case GET_CONVERSATIONS:
                return{
                    ...state,
                    users:action.payload.newArr,
                    resultData:action.payload.result,
                    firstLoad:true
                    };
            case GET_MESSAGES:
                return {
                    ...state,
                    data:[...state.data,action.payload]
                    
                }  ;    
                case UPDATE_MESSAGE:
                    return {
                        ...state,
                        data:EditData(state.data,action.payload._id,action.payload)

                    }  ;  
                    case DELETE_MESSAGE:
                        return {
                            ...state,
                            data:state.data.map(item=>(
                                item._id===action.payload._id ?
                                {
                                    ...item,messages:action.payload.newData
                                }:item
                            ))
    
                        }  ; 
                    case DELETE_CONVERSATION:
                        return{
                            ...state,
                            users:DeleteData(state.users,action.payload),
                            data:DeleteData(state.data,action.payload)
                        }   
                        case CHECK_ONLINE_OFFLINE:
                            return{
                                ...state,
                                users:state.users.map(user=>
                                    action.payload.includes(user._id) ?
                                    {...user,online:true}
                                    : {...user,online:false}
                                    )
                                
                            };                  
        default:
            return state;    
    }
}

export default messageReducer;