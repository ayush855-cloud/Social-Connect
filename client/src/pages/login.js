import React, { useState,useEffect } from 'react';
import { Link,useHistory } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import { login } from '../redux/actions/authActions';
import '../styles/auth.css';
import '../styles/header.css';

function Login() {
    const history=useHistory();
    const dispatch=useDispatch();
    const {auth}=useSelector((state)=>state);
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    })

    const [typePass,setTypePass]=useState(false);

    const handleChangeInput = (e) => {
        
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(login(userData));
    }
    useEffect(()=>{
        if(auth.token){
            history.push("/");
        }
    },[auth.token,history])
    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
            <h3 className="text-uppercase text-center mb-4" style={{fontSize:"35px",letterSpacing:'1px',color:'rgb(17, 87, 114)',fontWeight:'bold'}}>LOGIN</h3>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" value={userData.email} onChange={handleChangeInput} />

                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <div className="pass">
                    <input type={typePass ? "text" : "password" } name="password" value={userData.password} onChange={handleChangeInput} className="form-control" id="exampleInputPassword1" />
                    <small onClick={()=>setTypePass(!typePass)}>{typePass? "Hide":"Show"}</small>
                    </div>
                    
                </div>

                <button type="submit" className="btn btn-dark w-100" disabled={userData.email && userData.password ? false : true}>Login</button>
                <p className="my-2">You don't have an account</p>
                <div className="register"><Link to="/register" className="register__button"> Register Now</Link></div>

                
            </form>
        </div>
    )
}

export default Login
