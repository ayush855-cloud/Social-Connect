import { STATUS } from "../actions/profileActions";




const statusReducer=(state=false,action)=>{
    switch(action.type){
        case STATUS:
            return action.payload
        default:
            return state;         
    }
}

export default statusReducer;