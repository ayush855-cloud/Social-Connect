import { OFFLINE, ONLINE } from "../type/globalType";


const onlineReducer=(state=[],action)=>{
    switch(action.type){
        case ONLINE:
            return [...state,action.payload];
        case OFFLINE:
            return state.filter(item=>item !== action.payload)
        
        default:
            return state;         
    }
}

export default onlineReducer;