import React from 'react';
import LeftSide from '../components/message/LeftSide';
import '../styles/messanger.css';
import { useSelector } from 'react-redux';


function Message() {
    const {theme}=useSelector(state=>state);
    return (
        <div className="message d-flex">
        <div className="col-md-4 border-right px-0">
             <LeftSide/>
        </div>
        <div className="col-md-8 px-0 right_mess">
            <div className="d-flex justify-content-center align-items-center flex-column h-100">
            <i className="fab fa-facebook-messenger text-primary" 
                style={{fontSize:'5rem',filter: theme? 'invert(1)': 'invert(0)'}}
                
            />
            <h4>Messenger</h4>

            </div>
        </div>
        </div>
    )
}

export default Message
