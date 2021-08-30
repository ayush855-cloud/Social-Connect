import {THEME} from '../actions/authActions';

const initialState=false;

const themeReducer=(state=initialState,action)=>{
    switch(action.type){
        case THEME:
            return action.payload
        default:
            return state;      
    }
}

export default themeReducer;