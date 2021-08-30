import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { TYPE } from '../../redux/actions/notifyActions';
import Loading from '../Loading';
import Toast from '../Toast';

function Notify() {
    const dispatch=useDispatch();
    const {notify}=useSelector((state)=>state);
    return (
        <div>
            {notify.loading && <Loading/>}

            {notify.success && <Toast msg={{
                title:"Success",
                body:notify.success

            }}
            handleShow={()=>dispatch({type:TYPE.NOTIFY,payload:{}})} 
            bgColor="bg-success"/>}

            {notify.error && <Toast msg={{
                title:"Error",
                body:notify.error

            }}
            handleShow={()=>dispatch({type:TYPE.NOTIFY,payload:{}})} 
             bgColor="bg-danger"/>}
        </div>
    )
}

export default Notify
