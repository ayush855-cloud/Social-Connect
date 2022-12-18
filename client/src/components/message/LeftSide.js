import React,{useState,useEffect,useRef} from 'react'
import {useSelector,useDispatch} from 'react-redux';
import {getDataAPI} from '../../utils/fetchData';
import { TYPE } from '../../redux/actions/notifyActions';
import MessageSearchCard from '../MessageSearchCard';
import {useHistory} from 'react-router-dom';
import { ADD_USER, CHECK_ONLINE_OFFLINE } from '../../redux/actions/messageAction';
import { Avatar } from '@material-ui/core';
import '../../styles/messanger.css';
import SearchIcon from '@material-ui/icons/Search';
import {useParams} from 'react-router-dom';
import {getConversations} from '../../redux/actions/messageAction';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';



function LeftSide() {
    const history=useHistory();
    const {id}=useParams();
    const pageEnd=useRef();
    const [page,setPage]=useState(0);
    const [search,setSearch] =useState('');

    const [searchUsers,setSearchUsers]=useState([]);
    const {auth,message,theme,online}=useSelector(state=>state);
    const dispatch=useDispatch();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(search){
            getDataAPI(`search?username=${search}`,auth.token)
            .then(res=>setSearchUsers(res.data.users)
            ).catch(err=>{
                dispatch({type:TYPE.NOTIFY,payload:{error:err.response.data.msg}});
            })
        }
        else{
            setSearchUsers([]);
            setSearch('');
        }
    }

    const handleAddUser=(user)=>{
        setSearchUsers([]);
        setSearch('');
        dispatch({type:CHECK_ONLINE_OFFLINE,payload:online});
        dispatch({type:ADD_USER,payload:{...user,text:'',media:[]}});
        
        return history.push(`/message/${user._id}`);
    }

    const isActive=(user)=>{
        if(id===user._id) return "active";
        return '';
    }

    const handleExist=()=>{
        return history.push("/");
    }

    // Load More
    useEffect(()=>{
         if(message.firstLoad) return;
         dispatch(getConversations({auth}))
    },[dispatch,auth,message.firstLoad])

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(p => p + 1)
            }
        }, {
            threshold: 0.1
        })
        observer.observe(pageEnd.current)
    }, [setPage])


    useEffect(()=>{
      if(message.resultUser >= (page-1)*9 && page > 1 ){
          dispatch(getConversations({auth,page}))
      }
    },[message.resultUser,dispatch,auth,page])

    // check user
    useEffect(()=>{
        if(message.firstLoad)
        dispatch({type:CHECK_ONLINE_OFFLINE,payload:online}) 
    },[online,message.firstLoad,dispatch])


    return (
        <>
       
        <div style={{height:'75px',borderBottom:'1px solid lightgrey',display:'flex',justifyContent:'space-between',alignItems:'center',filter:theme?'invert(1)':'invert(0)'}} className="left-header">
        <Avatar src={auth.user.avatar} className="user_avatar" 
            />
        <ExitToAppIcon className="exit_icon mr-3" onClick={handleExist}/>
        
        </div>
        <form className="message_searcher" onSubmit={handleSubmit}>
            <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}
                placeholder="Enter to Search"
            />
            <SearchIcon className="search_icon"/>
            <button type="submit">Search</button>
            
        </form>
        
        
        <div className="message_chat_list">
        {
            searchUsers.length!==0 ? 
            <>
            {
                searchUsers.map(user=>(
                    (user._id !==auth.user._id) && 
                    <div key={user._id} onClick={()=>handleAddUser(user)} className={`message_user ${isActive(user)}`} style={{filter:theme?'invert(1)':'invert(0)'}}>
                    <MessageSearchCard user={user}/>
                    </div>
                ))
            }
        </>
        : <>
        {
                message.users.map(user=>(
                    <div key={user._id} onClick={()=>handleAddUser(user)} className={`message_user ${isActive(user)}`}>
                    <MessageSearchCard user={user} msg={true}>
                    {
                        user.online ?  <i className="fas fa-circle test-success" style={{filter:theme? 'invert(1)':'invert(0)'}}/>
                        :
                        auth.user.following.find(item=>
                        item._id === user._id
                        ) && 
                        <i className="fas fa-circle text-danger" style={{filter:theme? 'invert(1)':'invert(0)'}}/>

                    }
                   
                    </MessageSearchCard>
                    </div>
                ))
            }
        </>
        }
        <button ref={pageEnd} style={{opacity:'0'}}>Load More</button>
        </div>
          

        </>
    )
}

export default LeftSide
