import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import ReplayIcon from '@material-ui/icons/Replay';

import SuggestUserModal from './SuggestUserModal';
import Loading from './Loading';
import SuggestUser from './SuggestUser';
import { getSuggestions } from '../redux/actions/suggestionAction';


function RightSidebar() {
    const {auth,suggestions,notify,theme}=useSelector(state=>state);
    const dispatch=useDispatch();
    return (
        <div style={{position:'fixed'}}>
           <SuggestUserModal user={auth.user} key={auth.user._id}/> 
           <div className="d-flex justify-content-between align-items-center my-2 mx-3 w-100">
           <h5 style={{color:'rgb(17, 87, 114)',fontWeight:'700',fontSize:'1.2rem',filter:theme?'invert(1)':"invert(0)"}}>Suggestions for you</h5>
           {
               !notify.loading &&  <ReplayIcon onClick={()=>dispatch(getSuggestions(auth.token))}/>
           }
           
           </div>

           {
               notify.loading ? <Loading/>:
               <div className="suggestions">
                {
                    suggestions.users.map(user=>(
                        <>
                        
                    <SuggestUser key={user._id} user={user} />
                      </>
                ))
                }
               </div>
           }
        </div>
    )
}

export default RightSidebar
