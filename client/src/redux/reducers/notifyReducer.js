import {TYPE} from '../actions/notifyActions';

const initialState={}

const notifyReducer=(state=initialState,action)=>{
    switch(action.type){
        case TYPE.NOTIFY:
            return action.payload

        
        default:
            return state;         
    }
}

export default notifyReducer;