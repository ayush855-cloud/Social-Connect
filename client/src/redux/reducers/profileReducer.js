import { EditData } from "../type/globalType"

const { SET_PROFILE, FOLLOW, UNFOLLOW, GET_ID, GET_POSTS, UPDATE_POST } = require("../actions/profileActions")

const initialState={
    ids:[],
    users:[],
    posts:[],
}

const profileReducer=(state=initialState,action)=>{
    switch(action.type){
        case SET_PROFILE:
            return{
                ...state,
                users:[...state.users,action.payload.user]
            }
        case FOLLOW:
            return {
                ...state,
                users:EditData(state.users,action.payload._id,action.payload)
            }
        case UNFOLLOW:
            return{
                ...state,
                users:EditData(state.users,action.payload._id,action.payload)
            }   
        case GET_ID:
                return{
                    ...state,
                    ids:[...state.ids,action.payload]
                } 
        case GET_POSTS:
                return{
                    ...state,
                    posts:[...state.posts,action.payload]
                } 
        case UPDATE_POST:
            return{
                ...state,
                posts:EditData(state.posts,action.payload._id,action.payload)
            }                      
    default:
        return state;
}
}

export default profileReducer;