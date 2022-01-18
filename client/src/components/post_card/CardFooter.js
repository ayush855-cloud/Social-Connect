import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import TelegramIcon from '@material-ui/icons/Telegram';
import {useSelector,useDispatch} from 'react-redux';
import { BASE_URL } from '../../utils/config';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import LikeButton from '../LikeButton';
import { likePost, savedPost, unlikePost, unSavedPost } from '../../redux/actions/postActions';
import ShareModal from '../ShareModal';
import BookmarkIcon from '@material-ui/icons/Bookmark';

function CardFooter({post}) {
    const dispatch=useDispatch();
    const [isLike,setIsLike]=useState(false);
    const [loadLike,setLoadLike]=useState(false);
    const [saveLoad,setSaveLoad]=useState(false);
    const {auth,theme,socket}=useSelector(state=>state);
    const [isShare,setIsShare]=useState(false);
    const [saved,setSaved]=useState(false);

    const handleLike=async()=>{
        if(loadLike) return;
         
         setLoadLike(true);
         await dispatch(likePost({post,auth,socket}))
         setLoadLike(false);
    }
    const handleUnlike=async()=>{
        if(loadLike) return;
        
        setLoadLike(true);
        await dispatch(unlikePost({post,auth,socket}))
        setLoadLike(false);
        
    }
    const handleSavedPost=async()=>{
        if(saveLoad) return;
         
         setSaveLoad(true);
         await dispatch(savedPost({post,auth}))
         setSaveLoad(false);
    }
    const handleUnsavedPost=async()=>{
        if(saveLoad) return;
        
        setSaveLoad(true);
        await dispatch(unSavedPost({post,auth}))
        setSaveLoad(false);
        
    }
    useEffect(() => {
        if(post.likes?.find(like=>like._id===auth.user._id)){
            setIsLike(true)
        }
        else{
            setIsLike(false)
        }
       
    }, [post.likes,auth.user._id])

    useEffect(()=>{
        if(auth.user.saved?.find(id=>id===post._id)){
            setSaved(true)
        }
        else{
            setSaved(false)
        }
    },[auth.user.saved,post._id,auth.user._id])
    return (
        <div className="card_footer">
            <div className="card_icon_menu">
            <div className="icons_div">
                <LikeButton isLike={isLike} handleLike={handleLike} handleUnlike={handleUnlike}/>
                <Link to={`/post/${post._id}`} className="text-dark">
                <i className="far fa-comment" />
                </Link>
                <TelegramIcon className="material_telegram" onClick={()=>setIsShare(!isShare)}/>
                
            </div>
            {
                saved ? <BookmarkIcon className="bookmark" onClick={handleUnsavedPost} /> : <BookmarkBorderOutlinedIcon className="bookmark" onClick={handleSavedPost}/>
            }
           

            </div>
            <div className="d-flex justify-content-between">
           <h6 style={{padding:'0 25px',cursor:'pointer'}}>{post.likes.length} likes</h6>
           <h6 style={{padding:'0 25px',cursor:'pointer'}}>{post.comments.length} comments</h6>
            </div>
            {
                isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} theme={theme} />
            }
        </div>
    )
}

export default CardFooter
