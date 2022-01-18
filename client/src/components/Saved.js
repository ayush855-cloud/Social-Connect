import React,{useState,useEffect} from 'react'
import PostThumb from './post_card/PostThumb';
import Loading from '../components/Loading';
import LoadMoreBtn from './LoadMoreBtn';
import {getDataAPI} from '../utils/fetchData';
import { TYPE } from '../redux/actions/notifyActions';


function Saved({auth,dispatch}) {
    const [savedPosts,setSavedPosts]=useState([]);
    const [results,setResults]=useState(9);
    const [page,setPage]=useState(2);
    const [load,setLoad]=useState(false);

    useEffect(()=>{
        setLoad(true);
      getDataAPI('getSavedPosts',auth.token)
      .then(res=>{setSavedPosts(res.data.savedPosts)
      setResults(res.data.result)
      setLoad(false)
    }).catch(err=>{
          dispatch({type:TYPE.NOTIFY,payload:{error:err.response.data.msg}});
      })

      return ()=>setSavedPosts([])
    },[dispatch,auth.token])

    const handleLoadMore=async()=>{
       setLoad(true);
       const res=await getDataAPI(`getSavedPosts?limit=${page*9}`,auth.token);
       setSavedPosts(res.data.savedPosts);
       setResults(res.data.result);
       setPage(page+1);
       setLoad(false);
    }
    return (
        <div>
            <PostThumb posts={savedPosts} result={results}/>
            {
                load && <Loading />
            }
            <LoadMoreBtn result={results} page={page}
            load={load} handleLoadMore={handleLoadMore} />
        
        </div>
         
        
    )
}

export default Saved
