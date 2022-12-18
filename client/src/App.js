import {useEffect} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Notify from './components/notify/Notify';

import Login from './pages/login';
import {useSelector,useDispatch} from 'react-redux';
import Home from './pages/home';
import { refreshToken } from './redux/actions/authActions';
import Header from './components/header/Header';
import PrivateRouter from './customRouter/PrivateRouter';
import PageRender from './customRouter/PageRender';
import Register from './pages/register';
import StatusModal from './components/StatusModal';
import { getPosts } from './redux/actions/postActions';
import { getSuggestions } from './redux/actions/suggestionAction';
import io from 'socket.io-client';
import { PEER, SOCKET } from './redux/type/globalType';
import SocketClient from './SocketClient';
import { getNotifies } from './redux/actions/notifyActions';
import CallModal from './components/CallModal';
import Peer from 'peerjs';


function App() {
  const {auth,status,modal,call}=useSelector((state)=>state);
  const dispatch=useDispatch();
  
  useEffect(() => {
    dispatch(refreshToken())
    const socket=io();
    dispatch({type:SOCKET,payload:socket});
    return ()=>socket.close()
  }, [dispatch]);


  useEffect(()=>{
    if(auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
       
  },[dispatch,auth.token])


  useEffect(() => {

    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {

    }

    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }

  },[])

  useEffect(()=>{

      const newPeer=new Peer(undefined,{
        path:'/',secure:true
      })

      dispatch({type:PEER,payload:newPeer});

  },[dispatch])

  return (
    <>

      <Router>
      <Notify/>
        <input type="checkbox" id="theme" />
        <div className={`App ${(status|| modal) && 'mode'}`}>
          <div className="main">

            {auth.token && <Header/>}

            {status && <StatusModal/>}

            {auth.token && <SocketClient/>}

            {call && <CallModal/>}

             <Route exact path="/">
               {auth.token ? <Home/> : <Login/>}
             </Route>

             <Route exact path="/register">
                <Register/>
             </Route>

             <PrivateRouter exact path="/:page" component={PageRender} /> 

             <PrivateRouter exact path="/:page/:id" component={PageRender} /> 

          </div>
        </div>
      </Router>


    </>
  );
}

export default App;
