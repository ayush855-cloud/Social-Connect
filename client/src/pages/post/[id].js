import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import { getPost } from '../../redux/actions/postActions';
import Loading from '../../components/Loading';
import SinglePost from '../../components/SinglePost';

function Post() {
    const {id}=useParams();
    const dispatch=useDispatch();
    const [post,setPost]=useState([]);
    const {auth,detailPost}=useSelector(state=>state);

    useEffect(()=>{
        dispatch(getPost({detailPost,id,auth}))
        if(detailPost.length>0){
            const newArr=detailPost.filter(post=>post._id===id)
            setPost(newArr)
        }
    },[detailPost,dispatch,id,auth])
    return (
        <div className="posts">
            {
                post.length===0 &&
                <Loading/>
            }
            {
                post.map(item=>(
                   <SinglePost post={item} key={item._id}/>
                ))
            }
        </div>
    )
}

export default Post
