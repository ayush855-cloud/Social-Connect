import React,{useState,useEffect} from 'react'
import PostThumb from './post_card/PostThumb';
import Loading from '../components/Loading';
import LoadMoreBtn from './LoadMoreBtn';
import {getDataAPI} from '../utils/fetchData';
import { useSelector } from 'react-redux';
import { UPDATE_POST } from '../redux/actions/profileActions';

function PersonalPost({auth,id,dispatch,profile}) {
    const [posts,setPosts]=useState([]);
    const [results,setResults]=useState(9);
    const [page,setPage]=useState(0);
    const [load,setLoad]=useState(false);
    const {status,modal}=useSelector(state=>state);

    useEffect(()=>{
        profile.posts.forEach(data=>{
            if(data._id===id){
                setPosts(data.posts)
                setResults(data.result)
                setPage(data.page);
            }
        })
    },[profile.posts,id])

    const handleLoadMore=async()=>{
       setLoad(true);
       const res=await getDataAPI(`user_posts/${id}?limit=${page*9}`,auth.token);
       const newData={...res.data,page:page+1,_id:id};
       dispatch({type:UPDATE_POST,payload:newData});
       setLoad(false);
    }
    return (
        <div>
            <PostThumb posts={posts} result={results}/>
            {
                load && <Loading />
            }
            <div className={`${(status|| modal) && "close_load_more"}`}>
            <LoadMoreBtn result={results} page={page}
            load={load} handleLoadMore={handleLoadMore} />
            </div>
        
        </div>
         
        
    )
}

export default PersonalPost
