import React,{useState,useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../components/Loading';
import LoadMoreBtn from '../components/LoadMoreBtn';
import PostThumb from '../components/post_card/PostThumb';
import { DISCOVER_TYPES, getDiscoverPosts } from '../redux/actions/discoverAction';
import { getDataAPI } from '../utils/fetchData';


function Discover() {
    const {auth,discover,notify}=useSelector(state=>state);
    const dispatch=useDispatch();
    const [load,setLoad]=useState(false);
    // const [discoverPosts,setDiscoverPosts]=useState([]);
  
    useEffect(()=>{
        if(!discover.firstLoad){
            dispatch(getDiscoverPosts(auth.token));
        }
       
    },[dispatch,auth.token,discover.firstLoad])

    const handleLoadMore=async()=>{
        setLoad(true)
        const res=await getDataAPI(`post_discover?num=${discover.page*9}`,auth.token);
        dispatch({type:DISCOVER_TYPES.UPDATE_POSTS,payload:res.data})
        setLoad(false)
    }
    return (
        <div className="discover_posts">
            {
                notify.loading ? <Loading/> :
                <PostThumb posts={discover.posts} results={discover.result}/>
            }
            {
                load && <Loading/>
            }
            {
                !notify.loading && <LoadMoreBtn result={discover.result} page={discover.page}
                load={load} handleLoadMore={handleLoadMore} />
            }
            
            
        </div>
    )
}

export default Discover
