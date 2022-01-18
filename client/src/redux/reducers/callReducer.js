import { CALL } from "../type/globalType";



const callReducer=(state=null,action)=>{
    switch(action.type){
        case CALL:
            return action.payload
        default:
            return state;      
    }
}

export default callReducer;