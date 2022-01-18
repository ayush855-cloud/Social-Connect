import { MODAL } from "../type/globalType";

const modalReducer=(state=false,action)=>{
    switch(action.type){
        case MODAL:
            return action.payload
        default:
            return state;         
    }
}

export default modalReducer;