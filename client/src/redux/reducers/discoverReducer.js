import { DISCOVER_TYPES } from "../actions/discoverAction";


const initialState={
    posts:[],
    result:9,
    page:2,
    firstLoad:false
}


const discoverReducer=(state=initialState,action)=>{
    switch(action.type){
        case DISCOVER_TYPES.GET_POSTS:
            return {
                ...state,
                // posts:[...state.posts,action.payload.posts]
                posts:action.payload.posts,
                result:action.payload.result,
                firstLoad:true
            }
            case DISCOVER_TYPES.UPDATE_POSTS:
                return {
                    ...state,
                    // posts:[...state.posts,action.payload.posts]
                    posts:action.payload.posts,
                    result:action.payload.result,
                    page:state.page+1
                }    
        default:
            return state;      
    }
}

export default discoverReducer;