import React from 'react';
import {useSelector} from 'react-redux';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function LikeButton({isLike,handleLike,handleUnlike}) {
    const {theme}=useSelector(state=>state);
    return (
       <>
       {
           isLike ? <FavoriteIcon onClick={handleUnlike} className="material_icon text-danger"
               style={{filter:theme?'invert(1)':'invert(0)'}}
           /> : <FavoriteBorderIcon className="material_icon" onClick={handleLike}/>
       }
       </>
    )
}

export default LikeButton
