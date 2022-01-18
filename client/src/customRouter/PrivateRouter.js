import React from 'react'
import { Redirect,Route } from 'react-router-dom';

function PrivateRouter(props) {
    const firstLogin=localStorage.getItem("firstLogin");
    return firstLogin? <Route {...props}></Route>: <Redirect to="/" />
}

export default PrivateRouter
