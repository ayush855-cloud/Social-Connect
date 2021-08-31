import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import Posts from '../components/Posts';
import RightSidebar from '../components/RightSidebar';
import Status from '../components/Status';
import '../styles/home.css';

// npm i socket.io when outside client
// npm i socket.io-client  inside client
let scroll=0;

function Home(props) {
    const {homePosts}=useSelector(state=>state);

    window.addEventListener('scroll',()=>{
        if(window.location.pathname === '/'){
            scroll=window.pageYOffset
            return scroll;
        }
    })

    useEffect(()=>{
       setTimeout(()=>{
           window.scrollTo({top:scroll,behavior:'smooth'})
       },500)
    },[])
    return (
        <>
        {props.header}
        <div className="home row mx-8">
            <div className="col-md-8">
                <Status />
                {
                    homePosts.loading? <Loading/>: (homePosts.result===0 && homePosts.posts.length===0)
                        ? <h2 style={{color:"rgb(17, 87, 114)",fontWeight:"700",fontSize:'2.5rem'}}>No Post</h2>:
                    <Posts/>
                }
               
            </div>
            <div className="col-md-4" >
             <RightSidebar/>
            </div>
        </div>
        </>
    )
}

export default Home
