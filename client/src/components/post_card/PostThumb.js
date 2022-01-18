import React from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import '../../styles/post_thumb.css';

function PostThumb({posts,results}) {
    const {theme,modal}=useSelector(state=>state);
    if(results===0) return <h2 className="middle_text" >No Post</h2>
    return (
        <div className={`post_thumb ${modal && "above_everyone"}`}>
        {
            posts.map(post=>(
           <Link key={post._id} to={`/post/${post._id}`}>
            <div className="post_thumb_display">
            <img src={post.images[0].url} alt={post.images[0].url} 
                style={{filter:theme?'invert(1)':'invert(0)'}}
            />
            <div className="post_thumb_menu">
            <i className="fas fa-heart">{post.likes?.length}</i>
            <i className="far fa-comment">{post.comments?.length}</i>
            </div>

            </div>
           </Link>
            ))
        }
            
        </div>
    )
}

export default PostThumb
